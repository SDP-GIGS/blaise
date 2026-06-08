from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, WeeklyLog, InternshipPlacement, Notification


# Notify workplace supervisor when a student submits a log
@receiver(post_save, sender=WeeklyLog)
def notify_on_log_submit(sender, instance, created, **kwargs):
    if not created and instance.status == 'submitted':
        # Notify the workplace supervisor
        try:
            placement = instance.placement
            if placement.workplace_supervisor:
                Notification.objects.create(
                    recipient=placement.workplace_supervisor,
                    message=f"{instance.student.full_name} has submitted Week {instance.week_number} log for review."
                )
        except Exception:
            pass

# Notify student when their log is approved or rejected
@receiver(post_save, sender=WeeklyLog)
def notify_on_log_review(sender, instance, created, **kwargs):
    if not created and instance.status in ['approved', 'rejected']:
        Notification.objects.create(
            recipient=instance.student,
            message=f"Your Week {instance.week_number} log has been {instance.status}."
        )

# Notify academic supervisor when a student is assigned to them
@receiver(post_save, sender=InternshipPlacement)
def notify_on_placement_assigned(sender, instance, created, **kwargs):
    if created:
        # Notify academic supervisor
        if instance.academic_supervisor:
            Notification.objects.create(
                recipient=instance.academic_supervisor,
                message=f"{instance.student.full_name} has been assigned to you at {instance.company}."
            )
        # Notify workplace supervisor
        if instance.workplace_supervisor:
            Notification.objects.create(
                recipient=instance.workplace_supervisor,
                message=f"{instance.student.full_name} has been assigned to you at {instance.company}."
            )
        # Notify the student
        Notification.objects.create(
            recipient=instance.student,
            message=f"You have been assigned to {instance.company}. Your internship starts on {instance.start_date}."
        )

# Notify admin when a new user registers
@receiver(post_save, sender=CustomUser)
def notify_admin_on_register(sender, instance, created, **kwargs):
    if created and instance.role != 'admin':
        # Notify all admins
        admins = CustomUser.objects.filter(role='admin')
        for admin in admins:
            Notification.objects.create(
                recipient=admin,
                message=f"New {instance.role} registered: {instance.full_name} ({instance.email})."
            )