from django.urls import path
from . import views

urlpatterns = [
    path('stages/', views.StageListAPIView.as_view(), name='stages'),
]