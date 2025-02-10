from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from ..models import Stage
from .serializers import StageSerializer

@method_decorator(cache_page(None), name='dispatch')  # Cache forever (no expiration)
class StageListAPIView(ListAPIView):
    queryset = Stage.objects.all()
    serializer_class = StageSerializer
    permission_classes = [AllowAny]
