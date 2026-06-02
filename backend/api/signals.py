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