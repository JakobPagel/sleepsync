from rest_framework import serializers
from .models import SleepLog


class SleepLogSerializer(serializers.ModelSerializer):
    score       = serializers.IntegerField(read_only=True)
    score_label = serializers.CharField(read_only=True)
    ai_plan     = serializers.JSONField(read_only=True)
    total_sleep = serializers.FloatField(read_only=True)

    class Meta:
        model  = SleepLog
        fields = [
            "id", "date",
            "hrv", "resting_hr",
            "deep_sleep", "rem_sleep", "light_sleep",
            "respiratory_rate", "total_sleep",
            "score", "score_label", "ai_plan",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "score", "score_label", "ai_plan", "total_sleep", "created_at", "updated_at"]

    def validate_date(self, value):
        request = self.context.get("request")
        qs = SleepLog.objects.filter(user=request.user, date=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("You already have a log for this date.")
        return value


class SleepLogListSerializer(serializers.ModelSerializer):
    total_sleep = serializers.FloatField(read_only=True)

    class Meta:
        model  = SleepLog
        fields = ["id", "date", "score", "score_label", "total_sleep", "hrv"]