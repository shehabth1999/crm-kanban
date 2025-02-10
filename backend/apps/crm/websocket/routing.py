from django.urls import re_path
from .consumers import LeadConsumer

websocket_urlpatterns = [
    re_path(r'ws/leads/$', LeadConsumer.as_asgi()),
]