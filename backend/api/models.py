from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student Intern'),
        ('workplace_supervisor', 'Workplace Supervisor'),
        ('academic_supervisor', 'Academic Supervisor'),
        ('admin', 'Internship Administrator'),
    ]

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='student')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    def __str__(self):
        return f"{self.full_name} ({self.role})"
    
class InternshipPlacement(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    student = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='placements',
        limit_choices_to={'role': 'student'}
    )

    academic_supervisor = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='supervised_placements',
        limit_choices_to={'role': 'academic_supervisor'}
    )
    company = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.full_name} - {self.company}"
    
class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    student = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='weekly_logs',
        limit_choices_to={'role': 'student'}
    )

    placement = models.ForeignKey(
        InternshipPlacement,
        on_delete=models.CASCADE,
        related_name='logs'
    )

    week_number = models.PositiveIntegerField()
    date = models.DateField()
    activities = models.TextField()
    learnings = models.TextField()
    challenges = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    submitted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['student', 'week_number', 'placement']

    def __str__(self):
        return f"{self.student.full_name} - Week {self.week_number}"
    
class SupervisorReview(models.Model):
    STATUS_CHOICES = [
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    log = models.OneToOneField(
        WeeklyLog,
        on_delete=models.CASCADE,
        related_name='review'
    )
    supervisor = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='reviews',
        limit_choices_to={'role': 'workplace_supervisor'}
    )
    comment = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='reviewed')
    reviewed_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Review for {self.log} by {self.supervisor.full_name}"
    
class Evaluation(models.Model):
    TYPE_CHOICES = [
        ('workplace', 'Workplace Evaluation'),
        ('academic', 'Academic Evaluation'),
    ]

    student = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='evaluations',
        limit_choices_to={'role': 'student'}
    )

    evaluator = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='given_evaluations',
    )
    score = models.PositiveIntegerField()
    comments = models.TextField()
    evaluation_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ['student', 'evaluator']

    def __str__(self):
        return f"{self.evaluation_type} evaluation for {self.student.full_name} by {self.evaluator.full_name}"












