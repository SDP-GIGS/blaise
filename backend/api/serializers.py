from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, InternshipPlacement, WeeklyLog, SupervisorReview, Evaluation, CriteriaScore

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['full_name', 'email', 'student_number', 'role', 'password']

    def validate(self, data):
        if data.get('role') == 'student' and not data.get('student_number'):
            raise serializers.ValidationError({'student_number': 'Student number is required for students.'})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(
            username=validated_data.get('email'),
            full_name=validated_data.get('full_name'),
            email=validated_data.get('email'),
            student_number=validated_data.get('student_number'),
            role=validated_data.get('role', 'student'),
        )
        user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'full_name', 'email', 'role']
        read_only_fields = ['email']

class InternshipPlacementSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    academic_supervisor_name = serializers.CharField(source='academic_supervisor.full_name', read_only=True)
    workplace_supervisor_name = serializers.CharField(source='workplace_supervisor.full_name', read_only=True)

    class Meta:
        model = InternshipPlacement
        fields = [
            'id', 'student', 'student_name',
            'academic_supervisor', 'academic_supervisor_name',
            'workplace_supervisor', 'workplace_supervisor_name',
            'company', 'start_date', 'end_date', 'status', 'created_at'
        ]
        read_only_fields = ['created_at']

class WeeklyLogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)

    class Meta:
        model = WeeklyLog
        fields = ['id', 'student', 'student_name', 'placement', 'week_number', 'date', 'activities', 'learnings', 'challenges', 'status', 'submitted_at', 'created_at']
        read_only_fields = ['student', 'submitted_at', 'created_at']

class CriteriaScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = CriteriaScore
        fields = ['id', 'criteria', 'score', 'max_score']

class SupervisorReviewSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.CharField(source='supervisor.full_name', read_only=True)
    criteria_scores = CriteriaScoreSerializer(many=True, read_only=True)
    total_score = serializers.SerializerMethodField()

    class Meta:
        model = SupervisorReview
        fields = ['id', 'log', 'supervisor', 'supervisor_name', 'comment', 'status', 'reviewed_at', 'criteria_scores', 'total_score']
        read_only_fields = ['supervisor', 'reviewed_at']

    def get_total_score(self, obj):
        return obj.total_score()
        
class EvaluationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    evaluator_name = serializers.CharField(source='evaluator.full_name', read_only=True)
    criteria_scores = CriteriaScoreSerializer(many=True, read_only=True)
    total_score = serializers.SerializerMethodField()

    class Meta:
        model = Evaluation
        fields = ['id', 'student', 'student_name', 'evaluator', 'evaluator_name', 'comments', 'evaluation_type', 'date', 'criteria_scores', 'total_score']
        read_only_fields = ['evaluator', 'date']

    def get_total_score(self, obj):
        return obj.total_score()