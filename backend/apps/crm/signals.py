from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.crm.models import Lead

@receiver(post_save, sender=Lead)
def lead_post_save_handler(sender, instance, created, **kwargs):
    print(instance)

@receiver(post_delete, sender=Lead)
def lead_post_delete_handler(sender, instance, **kwargs):
    print(instance)
