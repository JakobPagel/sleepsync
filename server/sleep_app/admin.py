from django.contrib import admin
from .models import SleepLog

@admin.register(SleepLog)
class SleepLogAdmin(admin.ModelAdmin):
    list_display  = ["user", "date", "score", "score_label", "hrv", "resting_hr"]
    list_filter   = ["score_label"]
    search_fields = ["user__username"]