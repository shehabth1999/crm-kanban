from ..models import Lead, Stage
from rest_framework import serializers

class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = '__all__'


class LeadSerializer(serializers.ModelSerializer):
    stage = StageSerializer(read_only=True)
    class Meta:
        model = Lead
        fields = '__all__'

    def get_default_stage(self):
        stage , _ = Stage.objects.get_or_create(name='New')
        return stage
    
    def create(self, validated_data):
        stage = self.get_default_stage()
        lead = Lead.objects.create(stage=stage, **validated_data)
        return lead