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


def _format_relative_time(dt):
    if not dt:
        return "Just now"

    delta = timezone.now() - dt

    if delta.days > 0:
        return f"{delta.days} day{'s' if delta.days != 1 else ''} ago"

    hours = delta.seconds // 3600
    if hours > 0:
        return f"{hours} hour{'s' if hours != 1 else ''} ago"

    minutes = (delta.seconds % 3600) // 60
    if minutes > 0:
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"

    return "Just now"


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications_list(request):
    user = request.user
    notifications = []
    next_id = 1

    def add_notification(title, message, created_at=None, read=False, notification_type="info"):
        nonlocal next_id
        notifications.append({
            'id': next_id,
            'title': title,
            'message': message,
            'time': _format_relative_time(created_at),
            'read': read,
            'type': notification_type,
        })
        next_id += 1

    if user.role == 'student':
        recent_reviews = SupervisorReview.objects.filter(log__student=user).select_related('supervisor', 'log').order_by('-reviewed_at')[:5]
        for review in recent_reviews:
            add_notification(
                title=f"Weekly log {review.status}",
                message=f"Your Week {review.log.week_number} logbook was {review.status} by {review.supervisor.full_name}.",
                created_at=review.reviewed_at,
                read=review.status != 'reviewed',
                notification_type='success' if review.status == 'approved' else 'warning' if review.status == 'rejected' else 'info',
            )

        recent_evaluations = Evaluation.objects.filter(student=user).select_related('evaluator').order_by('-date')[:5]
        for evaluation in recent_evaluations:
            add_notification(
                title=f"{evaluation.evaluation_type.title()} evaluation submitted",
                message=f"{evaluation.evaluator.full_name} submitted a {evaluation.evaluation_type} evaluation for you.",
                created_at=evaluation.date,
                read=True,
                notification_type='success',
            )

    elif user.role in ['academic_supervisor', 'workplace_supervisor']:
        placement_filter = {
            'academic_supervisor': 'academic_supervisor',
            'workplace_supervisor': 'workplace_supervisor',
        }[user.role]
        assigned_placements = InternshipPlacement.objects.filter(**{placement_filter: user}).select_related('student').order_by('-created_at')
        assigned_student_ids = list(assigned_placements.values_list('student_id', flat=True))

        submitted_logs = WeeklyLog.objects.filter(student_id__in=assigned_student_ids, status='submitted').select_related('student', 'placement').order_by('-submitted_at')[:10]
        for log in submitted_logs:
            add_notification(
                title="Weekly logbook submitted",
                message=f"{log.student.full_name} submitted Week {log.week_number} for {log.placement.company}.",
                created_at=log.submitted_at,
                read=False,
                notification_type='info',
            )

        if user.role == 'academic_supervisor':
            pending_evaluations = []
            for placement in assigned_placements:
                has_evaluation = Evaluation.objects.filter(student=placement.student, evaluator=user, evaluation_type='academic').exists()
                if not has_evaluation:
                    pending_evaluations.append(placement)

            for placement in pending_evaluations[:10]:
                add_notification(
                    title="Academic evaluation due",
                    message=f"Evaluation is due for {placement.student.full_name} at {placement.company}.",
                    created_at=placement.created_at,
                    read=False,
                    notification_type='warning',
                )

        recent_placements = assigned_placements[:5]
        for placement in recent_placements:
            add_notification(
                title="Placement assigned",
                message=f"{placement.student.full_name} is assigned to {placement.company}.",
                created_at=placement.created_at,
                read=True,
                notification_type='success',
            )

    elif user.role == 'admin':
        recent_placements = InternshipPlacement.objects.select_related('student').order_by('-created_at')[:5]
        for placement in recent_placements:
            add_notification(
                title="Placement activity",
                message=f"{placement.student.full_name} has a placement at {placement.company}.",
                created_at=placement.created_at,
                read=True,
                notification_type='info',
            )

        recent_logs = WeeklyLog.objects.select_related('student').order_by('-submitted_at', '-created_at')[:5]
        for log in recent_logs:
            add_notification(
                title="Logbook activity",
                message=f"{log.student.full_name} logbook week {log.week_number} is {log.status}.",
                created_at=log.submitted_at or log.created_at,
                read=log.status != 'submitted',
                notification_type='warning' if log.status == 'submitted' else 'info',
            )

    if not notifications:
        add_notification(
            title="No notifications",
            message="You are all caught up for now.",
            created_at=timezone.now(),
            read=True,
            notification_type='info',
        )

    return Response(notifications)

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
    identifier = request.data.get('identifier', '')
    password = request.data.get('password', '')

    user = None

    # Try student number first
    try:
        user_by_student_number = CustomUser.objects.get(student_number=identifier)
        user = authenticate(request, username=user_by_student_number.username, password=password)
    except CustomUser.DoesNotExist:
        pass

    # Try email if student number didn't work
    if user is None:
        try:
            user_by_email = CustomUser.objects.get(email=identifier)
            user = authenticate(request, username=user_by_email.username, password=password)
        except CustomUser.DoesNotExist:
            pass

    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)
    return Response({
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_list(request):
    # Supervisors and admins can fetch student records for evaluation workflows.
    if request.user.role not in ['academic_supervisor', 'workplace_supervisor', 'admin']:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    if request.user.role == 'academic_supervisor':
        assigned_student_ids = InternshipPlacement.objects.filter(
            academic_supervisor=request.user
        ).values_list('student_id', flat=True)
        students = CustomUser.objects.filter(id__in=assigned_student_ids, role='student').order_by('full_name')
    elif request.user.role == 'workplace_supervisor':
        assigned_student_ids = InternshipPlacement.objects.filter(
            workplace_supervisor=request.user
        ).values_list('student_id', flat=True)
        students = CustomUser.objects.filter(id__in=assigned_student_ids, role='student').order_by('full_name')
    else:
        students = CustomUser.objects.filter(role='student').order_by('full_name')

    serializer = UserSerializer(students, many=True)
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

        student_id = request.data.get('student')
        if not student_id:
            return Response({'error': 'Student is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = CustomUser.objects.get(pk=student_id, role='student')
        except CustomUser.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        # Set evaluation type based on role
        evaluation_type = 'workplace' if request.user.role == 'workplace_supervisor' else 'academic'

        # Enforce that supervisors can only evaluate students assigned to them.
        if request.user.role == 'workplace_supervisor':
            is_assigned = InternshipPlacement.objects.filter(
                workplace_supervisor=request.user,
                student=student,
            ).exists()
            if not is_assigned:
                return Response(
                    {'error': 'You can only evaluate students assigned to your workplace.'},
                    status=status.HTTP_403_FORBIDDEN,
                )
        elif request.user.role == 'academic_supervisor':
            is_assigned = InternshipPlacement.objects.filter(
                academic_supervisor=request.user,
                student=student,
            ).exists()
            if not is_assigned:
                return Response(
                    {'error': 'You can only evaluate students assigned to you.'},
                    status=status.HTTP_403_FORBIDDEN,
                )

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
    workplace_eval = Evaluation.objects.filter(student=student, evaluation_type='workplace').first()
    if workplace_eval:
        workplace_total = workplace_eval.total_score()
        workplace_contribution = (workplace_total / 100) * 40
    else:
        workplace_total = 0
        workplace_contribution = 0

    # ── Academic Evaluation (30%) ──
    academic_eval = Evaluation.objects.filter(student=student, evaluation_type='academic').first()
    if academic_eval:
        academic_total = academic_eval.total_score()
        academic_contribution = (academic_total / 100) * 30
    else:
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

    return Response({
        'student': UserSerializer(student).data,
        'workplace_evaluation': {
            'score': workplace_total,
            'out_of': 100,
            'contribution': round(workplace_contribution, 2),
            'weight': '40%',
        },
        'academic_evaluation': {
            'score': academic_total,
            'out_of': 100,
            'contribution': round(academic_contribution, 2),
            'weight': '30%',
        },
        'logbook': {
            'average_score': round(average_log_score, 2),
            'out_of': 30,
            'logs_reviewed': len(log_scores),
            'contribution': round(logbook_contribution, 2),
            'weight': '30%',
        },
        'final_score': final_score,
        'final_score_out_of': 100,
    })