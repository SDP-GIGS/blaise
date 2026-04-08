from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from .models import CustomUser, InternshipPlacement, WeeklyLog, SupervisorReview, Evaluation, CriteriaScore
from .serializers import (
    RegisterSerializer, UserSerializer,
    InternshipPlacementSerializer, WeeklyLogSerializer,
    SupervisorReviewSerializer, EvaluationSerializer, CriteriaScoreSerializer
)

@api_view(['GET'])
def dashboard(request):
    user = request.user

    if user.role == 'student':
        total_logs = WeeklyLog.objects.filter(student=user).count()
        pending_reviews = WeeklyLog.objects.filter(student=user, status='submitted').count()
        approved_logs = WeeklyLog.objects.filter(student=user, status='approved').count()
        evaluations = Evaluation.objects.filter(student=user).count()

        return Response({
            'logbook_entries': total_logs,
            'pending_reviews': pending_reviews,
            'approved_logs': approved_logs,
            'evaluations': evaluations,
        })
    
    elif user.role == 'workplace_supervisor':
        pending_reviews = WeeklyLog.objects.filter(status='submitted').count()
        completed_reviews = SupervisorReview.objects.filter(supervisor=user).count()
        total_students = InternshipPlacement.objects.values('student').distinct().count()

        return Response({
            'pending_reviews': pending_reviews,
            'completed_reviews': completed_reviews,
            'total_students': total_students,
        })
    
    elif user.role == 'academic_supervisor':
        total_students = InternshipPlacement.objects.values('student').distinct().count()
        evaluations_given = Evaluation.objects.filter(evaluator=user).count()
        approved_logs = WeeklyLog.objects.filter(status='approved').count()

        return Response({
            'total_students': total_students,
            'evaluations_given': evaluations_given,
            'approved_logs': approved_logs,
        })

    elif user.role == 'admin':
        total_students = CustomUser.objects.filter(role='student').count()
        total_supervisors = CustomUser.objects.filter(role='workplace_supervisor').count()
        total_placements = InternshipPlacement.objects.count()
        total_logs = WeeklyLog.objects.count()
        pending_reviews = WeeklyLog.objects.filter(status='submitted').count()


        return Response({
            'total_students': total_students,
            'total_supervisors': total_supervisors,
            'total_placements': total_placements,
            'total_logs': total_logs,
            'pending_reviews': pending_reviews,
        })

    return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def placement_list(request):
    if request.method == 'GET':
        if request.user.role == 'student':
            placements = InternshipPlacement.objects.filter(student=request.user)
        elif request.user.role == 'academic_supervisor':
            placements = InternshipPlacement.objects.filter(academic_supervisor=request.user)
        elif request.user.role == 'workplace_supervisor':
            placements = InternshipPlacement.objects.filter(workplace_supervisor=request.user)
        else:
            placements = InternshipPlacement.objects.all()
        serializer = InternshipPlacementSerializer(placements, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        data = request.data.copy()
        if data.get('academic_supervisor') == '':
            data['academic_supervisor'] = None
        if data.get('workplace_supervisor') == '':
            data['workplace_supervisor'] = None
        serializer = InternshipPlacementSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def placement_detail(request, pk):
    try:
        placement = InternshipPlacement.objects.get(pk=pk)
    except InternshipPlacement.DoesNotExist:
        return Response({'error': 'Placement not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = InternshipPlacementSerializer(placement)
        return Response(serializer.data)

    if request.method == 'PUT':
        data = request.data.copy()
        if data.get('academic_supervisor') == '':
            data['academic_supervisor'] = None
        if data.get('workplace_supervisor') == '':
            data['workplace_supervisor'] = None
        serializer = InternshipPlacementSerializer(placement, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        placement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def log_list(request):
    if request.method == 'GET':
        if request.user.role == 'student':
            logs = WeeklyLog.objects.filter(student=request.user)
        elif request.user.role == 'workplace_supervisor':
            assigned_students = InternshipPlacement.objects.filter(
                workplace_supervisor=request.user
            ).values_list('student', flat=True)
            logs = WeeklyLog.objects.filter(
                student__in=assigned_students,
                status__in=['submitted', 'reviewed', 'approved', 'rejected']
            )
        elif request.user.role == 'academic_supervisor':
            assigned_students = InternshipPlacement.objects.filter(
                academic_supervisor=request.user
            ).values_list('student', flat=True)
            logs = WeeklyLog.objects.filter(student__in=assigned_students)
        else:
            logs = WeeklyLog.objects.all()
        serializer = WeeklyLogSerializer(logs, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = WeeklyLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(student=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
def log_detail(request, pk):
    try:
        log = WeeklyLog.objects.get(pk=pk)
    except WeeklyLog.DoesNotExist:
        return Response({'error': 'Log not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = WeeklyLogSerializer(log)
        return Response(serializer.data)

    if request.method == 'PUT':
        if log.status != 'draft':
            return Response({'error': 'Only draft logs can be edited'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = WeeklyLogSerializer(log, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def log_submit(request, pk):
    try:
        log = WeeklyLog.objects.get(pk=pk, student=request.user)
    except WeeklyLog.DoesNotExist:
        return Response({'error': 'Log not found'}, status=status.HTTP_404_NOT_FOUND)

    if log.status != 'draft':
        return Response({'error': 'Only draft logs can be submitted'}, status=status.HTTP_400_BAD_REQUEST)

    log.status = 'submitted'
    log.submitted_at = timezone.now()
    log.save()
    return Response(WeeklyLogSerializer(log).data)


# ── SUPERVISOR REVIEW ──
@api_view(['GET', 'POST'])
def review_list(request):
    if request.method == 'GET':
        if request.user.role == 'workplace_supervisor':
            reviews = SupervisorReview.objects.filter(supervisor=request.user)
        elif request.user.role == 'admin':
            reviews = SupervisorReview.objects.all()
        else:
            reviews = SupervisorReview.objects.none()
        serializer = SupervisorReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        if request.user.role != 'workplace_supervisor':
            return Response(
                {'error': 'Only workplace supervisors can review logs'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Expected criteria for logbook review
        LOGBOOK_CRITERIA = [
            {'criteria': 'quality_of_work', 'max_score': 10},
            {'criteria': 'initiative', 'max_score': 10},
            {'criteria': 'punctuality', 'max_score': 10},
        ]

        criteria_data = request.data.get('criteria_scores', [])

        serializer = SupervisorReviewSerializer(data=request.data)
        if serializer.is_valid():
            review = serializer.save(supervisor=request.user)

            # Save each criterion score
            for criterion in LOGBOOK_CRITERIA:
                score_entry = next(
                    (c for c in criteria_data if c.get('criteria') == criterion['criteria']), None
                )
                score_value = score_entry.get('score', 0) if score_entry else 0
                # Clamp score to max
                score_value = min(score_value, criterion['max_score'])
                CriteriaScore.objects.create(
                    review=review,
                    criteria=criterion['criteria'],
                    score=score_value,
                    max_score=criterion['max_score']
                )

            # Update the log status
            log = review.log
            if review.status == 'approved':
                log.status = 'approved'
            elif review.status == 'rejected':
                log.status = 'rejected'
            else:
                log.status = 'reviewed'
            log.save()

            return Response(SupervisorReviewSerializer(review).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── EVALUATION ──
@api_view(['GET', 'POST'])
def evaluation_list(request):
    if request.method == 'GET':
        if request.user.role == 'student':
            evaluations = Evaluation.objects.filter(student=request.user)
        elif request.user.role in ['academic_supervisor', 'workplace_supervisor']:
            evaluations = Evaluation.objects.filter(evaluator=request.user)
        elif request.user.role == 'admin':
            evaluations = Evaluation.objects.all()
        else:
            evaluations = Evaluation.objects.none()
        serializer = EvaluationSerializer(evaluations, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        if request.user.role not in ['academic_supervisor', 'workplace_supervisor']:
            return Response(
                {'error': 'Only supervisors can submit evaluations'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Set evaluation type based on role
        evaluation_type = 'workplace' if request.user.role == 'workplace_supervisor' else 'academic'

        # Expected criteria based on type
        WORKPLACE_CRITERIA = [
            {'criteria': 'technical_competence', 'max_score': 20},
            {'criteria': 'professionalism', 'max_score': 20},
            {'criteria': 'teamwork', 'max_score': 20},
            {'criteria': 'problem_solving', 'max_score': 20},
            {'criteria': 'overall_attitude', 'max_score': 20},
        ]
        ACADEMIC_CRITERIA = [
            {'criteria': 'understanding', 'max_score': 20},
            {'criteria': 'documentation', 'max_score': 20},
            {'criteria': 'report_writing', 'max_score': 20},
            {'criteria': 'professional_development', 'max_score': 20},
            {'criteria': 'academic_progress', 'max_score': 20},
        ]

        criteria_list = WORKPLACE_CRITERIA if evaluation_type == 'workplace' else ACADEMIC_CRITERIA
        criteria_data = request.data.get('criteria_scores', [])

        # Inject evaluation type
        data = request.data.copy()
        data['evaluation_type'] = evaluation_type

        serializer = EvaluationSerializer(data=data)
        if serializer.is_valid():
            evaluation = serializer.save(evaluator=request.user)

            # Save each criterion score
            for criterion in criteria_list:
                score_entry = next(
                    (c for c in criteria_data if c.get('criteria') == criterion['criteria']), None
                )
                score_value = score_entry.get('score', 0) if score_entry else 0
                score_value = min(score_value, criterion['max_score'])
                CriteriaScore.objects.create(
                    evaluation=evaluation,
                    criteria=criterion['criteria'],
                    score=score_value,
                    max_score=criterion['max_score']
                )

            return Response(EvaluationSerializer(evaluation).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── ADMIN ──
@api_view(['GET'])
def user_list(request):
    if request.user.role != 'admin':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    users = CustomUser.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
   
@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    if request.user.role != 'admin':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = CustomUser.objects.get(pk=pk)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    if request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
def users_by_role(request, role):
    if request.user.role != 'admin':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    users = CustomUser.objects.filter(role=role)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def student_score(request, student_id):
    try:
        student = CustomUser.objects.get(pk=student_id, role='student')
    except CustomUser.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

    # ── Workplace Evaluation (40%) ──
    try:
        workplace_eval = Evaluation.objects.get(student=student, evaluation_type='workplace')
        workplace_total = workplace_eval.total_score()
        workplace_max = 100
        workplace_contribution = (workplace_total / workplace_max) * 40
    except Evaluation.DoesNotExist:
        workplace_total = 0
        workplace_contribution = 0

# ── Academic Evaluation (30%) ──
    try:
        academic_eval = Evaluation.objects.get(student=student, evaluation_type='academic')
        academic_total = academic_eval.total_score()
        academic_max = 100
        academic_contribution = (academic_total / academic_max) * 30
    except Evaluation.DoesNotExist:
        academic_total = 0
        academic_contribution = 0

 # ── Logbook Score (30%) ──
    reviewed_logs = WeeklyLog.objects.filter(
        student=student,
        status__in=['reviewed', 'approved']
    )
    log_scores = []
    for log in reviewed_logs:
        try:
            review = log.review
            log_scores.append(review.total_score())
        except SupervisorReview.DoesNotExist:
            pass

    if log_scores:
        average_log_score = sum(log_scores) / len(log_scores)
        logbook_contribution = (average_log_score / 30) * 30
    else:
        average_log_score = 0
        logbook_contribution = 0

    final_score = round(workplace_contribution + academic_contribution + logbook_contribution, 2)

    