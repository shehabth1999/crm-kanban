from apps.crm.websocket.routing import websocket_urlpatterns as crm_websocket_urls

websocket_urlpatterns = []

# Add crm routes to global list
websocket_urlpatterns += crm_websocket_urls  
