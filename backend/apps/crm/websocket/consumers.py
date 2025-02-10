import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .handlers import LeadService
from asgiref.sync import sync_to_async
from ..models import Lead, Stage
from ..api.serializers import LeadSerializer

class LeadConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for handling lead-related actions"""

    async def connect(self):
        """Client connects to WebSocket"""
        self.room_name = "leads_updates"
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()
        print("WebSocket Connected")

        leads = await self.get_leads()
        await self.send(text_data=json.dumps({"action": "initial_data", "data": leads}))

    async def disconnect(self, close_code):
        """Client disconnects from WebSocket"""
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        print("WebSocket Disconnected")

    async def receive(self, text_data):
        """Receive WebSocket data and process it"""
        action, data = await self.validate_request(text_data)

        if not action:
            return await self.send(text_data=json.dumps({"error": data}))        

        # Use LeadService to process the request
        service_method = getattr(LeadService, action, None)
        if service_method:
            response = await service_method(data)
            await self.broadcast_update(action, response)
        else:
            await self.send(text_data=json.dumps({"error": "Invalid action"}))

    @sync_to_async
    def validate_request(self, text_data):
        """Validate incoming WebSocket data"""
        try:
            message_json = json.loads(text_data)
            action = message_json.get("action")
            data = message_json.get("data")

            if not action or action not in dir(LeadService):
                return False, f"Invalid action: {action}"

            return action, data
        except Exception as e:
            return False, f"Invalid data: {str(e)}"
        
    @sync_to_async
    def get_leads(self):
        """Fetch all leads from the database and serialize them"""
        leads = Lead.objects.all().order_by('stage')
        stages = Stage.objects.all().order_by('id')
        leads_data = LeadSerializer(leads, many=True).data
        listed_ids = {}
        for stage in stages:
            listed_ids[stage.id] = [lead for lead in leads_data if lead['stage']['id'] == stage.id]
        return listed_ids    
    

    async def broadcast_update(self, action, lead_data):
        """Send updates to all WebSocket clients"""
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "send_lead_update",
                "action": action,
                "data": lead_data,
            },
        )

    async def send_lead_update(self, event):
        """Helper function to send data to WebSocket clients"""
        await self.send(text_data=json.dumps({"action": event["action"], "data": event["data"]}))