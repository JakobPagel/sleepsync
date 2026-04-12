from django.urls import path
from .views import (
    SleepLogListCreateView,
    SleepLogDetailView,
    TodayLogView,
    GeneratePlanView,
)

urlpatterns = [
    path("logs/", SleepLogListCreateView.as_view(), name="log-list-create"),
    path("logs/today/", TodayLogView.as_view(), name="log-today"),
    path("logs/<int:pk>/", SleepLogDetailView.as_view(), name="log-detail"),
    path("logs/<int:pk>/generate-plan/", GeneratePlanView.as_view(), name="log-generate-plan"),
]
