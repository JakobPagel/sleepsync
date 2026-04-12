from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
import anthropic
from datetime import date
import json

from .models import SleepLog
from .serializers import SleepLogSerializer, SleepLogListSerializer


class SleepLogListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return SleepLogListSerializer
        return SleepLogSerializer

    def get_queryset(self):
        return SleepLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SleepLogDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class   = SleepLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SleepLog.objects.filter(user=self.request.user)


class TodayLogView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            log = SleepLog.objects.get(user=request.user, date=date.today())
            return Response(SleepLogSerializer(log).data)
        except SleepLog.DoesNotExist:
            return Response({"detail": "No log for today."}, status=404)


class GeneratePlanView(APIView):
    """3rd Party API — Anthropic Claude generates a recovery plan."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            log = SleepLog.objects.get(pk=pk, user=request.user)
        except SleepLog.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)

        try:
            client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
            message = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=400,
                messages=[{
                    "role": "user",
                    "content": f"""You are a sleep science and recovery coach. Based on these objective biometric metrics from a wearable device, generate a concise personalized daily plan.

Biometric Data:
- HRV: {log.hrv}ms
- Resting Heart Rate: {log.resting_hr}bpm
- Deep Sleep: {log.deep_sleep}hrs
- REM Sleep: {log.rem_sleep}hrs
- Light Sleep: {log.light_sleep}hrs
- Total Sleep: {log.total_sleep}hrs
- Respiratory Rate: {log.respiratory_rate} breaths/min
- Recovery Score: {log.score}/100 ({log.score_label.upper()})

Respond ONLY with valid JSON, no markdown, no extra text:
{{"energy": "one sentence energy guidance based on the data", "workout": "one sentence workout recommendation", "focus": "one sentence focus recommendation", "tips": ["specific tip referencing a metric", "specific tip referencing a metric"]}}"""
                }]
            )
            text = message.content[0].text.strip()
            plan = json.loads(text)
            log.ai_plan = plan
            log.save()
            return Response(SleepLogSerializer(log).data)
        except Exception as e:
            return Response({"detail": str(e)}, status=500)