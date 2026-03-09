from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/me/', views.get_current_user, name='current_user'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]