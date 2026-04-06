from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from .serializers import (
    RegisterSerializer, UserSerializer,
    InternshipPlacementSerializer, WeeklyLogSerializer,
    SupervisorReviewSerializer, EvaluationSerializer
)
from .models import CustomUser, InternshipPlacement, WeeklyLog, SupervisorReview, Evaluation

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


# ── INTERNSHIP PLACEMENT ──
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

    if request.method == 'POST':
        serializer = InternshipPlacementSerializer(data=request.data)
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
        serializer = InternshipPlacementSerializer(placement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        placement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── WEEKLY LOG ──
@api_view(['GET', 'POST'])
def log_list(request):
    if request.method == 'GET':
        if request.user.role == 'student':
            logs = WeeklyLog.objects.filter(student=request.user)
        elif request.user.role == 'workplace_supervisor':
            logs = WeeklyLog.objects.filter(status__in=['submitted', 'reviewed', 'approved', 'rejected'])
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
        else:
            reviews = SupervisorReview.objects.all()
        serializer = SupervisorReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = SupervisorReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(supervisor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── EVALUATION ──
@api_view(['GET', 'POST'])
def evaluation_list(request):
    if request.method == 'GET':
        if request.user.role == 'student':
            evaluations = Evaluation.objects.filter(student=request.user)
        elif request.user.role in ['workplace_supervisor', 'academic_supervisor']:
            evaluations = Evaluation.objects.filter(evaluator=request.user)
        else:
            evaluations = Evaluation.objects.all()
        serializer = EvaluationSerializer(evaluations, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = EvaluationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(evaluator=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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