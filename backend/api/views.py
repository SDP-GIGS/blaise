from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer, InternshipPlacementSerializer, WeeklyLogSerializer, SupervisorReviewSerializer, EvaluationSerializer
from .models import InternshipPlacement, WeeklyLog, SupervisorReview, Evaluation
from django.utils import timezone

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    tokens = get_tokens_for_user(user)
    user_data = UserSerializer(user).data
    return Response({
        'user': user_data,
        'tokens': tokens,
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)

    if user is None:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    tokens = get_tokens_for_user(user)
    user_data = UserSerializer(user).data
    return Response({
        'user': user_data,
        'tokens': tokens,
    })


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
        else:
            placements = InternshipPlacement.objects.all()
        serializer = InternshipPlacementSerializer(placements, many=True)
        return Response(serializer.data)
    
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
    
















    