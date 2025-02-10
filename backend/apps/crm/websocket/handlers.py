import json
from asgiref.sync import sync_to_async
from ..models import Lead, Stage
from ..api.serializers import LeadSerializer

class LeadService:
    """
        Handles all Lead-related WebSocket 
        action must be same as the method name
    """

    @staticmethod
    @sync_to_async
    def create_lead(data):
        serializer = LeadSerializer(data=data)
        if serializer.is_valid():
            lead = serializer.save()
            return LeadSerializer(lead).data
        return {"error": serializer.errors}

    @staticmethod
    @sync_to_async
    def update_lead(data):
        lead_id = data.pop('lead_id', None)
        if not lead_id:
            return {"error": "Invalid lead_id"}

        lead = Lead.objects.filter(pk=lead_id).first()
        if not lead:
            return {"error": "Lead not found"}

        serializer = LeadSerializer(lead, data=data)
        if serializer.is_valid():
            lead = serializer.save()
            return LeadSerializer(lead).data
        return {"error": serializer.errors}

    @staticmethod
    @sync_to_async
    def delete_lead(data):
        lead_id = data.get('lead_id')
        if not lead_id:
            return {"error": "Invalid lead_id"}

        lead = Lead.objects.filter(pk=lead_id).first()
        if not lead:
            return {"error": "Lead not found"}
        try:
            lead_data_holder = LeadSerializer(lead).data
            lead.delete()
            return lead_data_holder
        except Exception as e :
            return {"error": f"Failed to delete lead: {str(e)}"}
        

    @staticmethod
    @sync_to_async
    def change_stage(data):
        lead_id = data.get('lead_id')
        stage_id = data.get('stage_id')
        
        if not lead_id or not stage_id:
            return {"error": "Invalid lead_id or stage_id"}
        
        lead = Lead.objects.filter(pk=lead_id).first()
        if not lead:
            return {"error": "Lead not found"}
        
        stage = Stage.objects.filter(pk=stage_id).first()
        if not stage:
            return {"error": "Stage not found"}
        
        lead.stage = stage
        lead.save()
        return LeadSerializer(lead).data