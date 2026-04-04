from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views



urlpatterns = [
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/me/', views.get_current_user, name='current_user'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Internship Placements
    path('placements/', views.placement_list, name='placement_list'),
    path('placements/<int:pk>/', views.placement_detail, name='placement_detail'),

    # Weekly Logs
    path('logs/', views.log_list, name='log_list'),
    path('logs/<int:pk>/', views.log_detail, name='log_detail'),
    path('logs/<int:pk>/submit/', views.log_submit, name='log_submit'),

    # Supervisor Reviews
    path('reviews/', views.review_list, name='review_list'),

    # Evaluations
    path('evaluations/', views.evaluation_list, name='evaluation_list'),

    path('dashboard/', views.dashboard, name='dashboard'),

]











