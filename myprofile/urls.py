from django.urls import path
from . import views
from .views import EmailSend
urlpatterns = [
    path('', views.index , name='index'),
    path('api/send-email/', EmailSend.as_view(), name='send-email'),
]