from django.db import models
from django.db.models.signals import post_migrate
from django.dispatch import receiver


class Stage(models.Model):
    name            = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"Stage {self.name}"


@receiver(post_migrate)
def create_default_stages(sender, **kwargs):
    if sender.name == "apps.crm": 
        default_stages = [
            "New",
            "In Hold",
            "In Progress",
            "Closed - Done",
            "Closed - Lost",
        ]
        for stage in default_stages:
            Stage.objects.get_or_create(name=stage)
        print("✅ Default stages created successfully!")


class Lead(models.Model):
    stage           = models.ForeignKey(Stage, on_delete=models.CASCADE, related_name="leads")

    name            = models.CharField(max_length=255)
    email           = models.EmailField(blank=True, null=True)

    updated_at      = models.DateTimeField(auto_now=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lead {self.name}"