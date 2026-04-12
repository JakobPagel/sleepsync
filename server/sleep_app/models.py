from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class SleepLog(models.Model):
    user             = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sleep_logs")
    date             = models.DateField()
    hrv              = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(300)], default=0)
    resting_hr       = models.FloatField(validators=[MinValueValidator(20), MaxValueValidator(220)], default=0)
    deep_sleep       = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(12)], default=0)
    rem_sleep        = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(12)], default=0)
    light_sleep      = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(12)], default=0)
    respiratory_rate = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(40)], default=0)
    score            = models.IntegerField(null=True, blank=True)
    score_label      = models.CharField(max_length=4, blank=True, default="")
    ai_plan          = models.JSONField(null=True, blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        ordering        = ["-date"]
        unique_together = ["user", "date"]

    @property
    def total_sleep(self):
        return self.deep_sleep + self.rem_sleep + self.light_sleep

    def calculate_score(self):
        hrv_score = min(100, max(0, ((self.hrv - 20) / 80) * 100))
        hr_score  = min(100, max(0, ((85 - self.resting_hr) / 45) * 100))

        if 1.5 <= self.deep_sleep <= 2.5:
            deep_score = 100
        elif self.deep_sleep >= 1.0:
            deep_score = 70
        elif self.deep_sleep >= 0.5:
            deep_score = 40
        else:
            deep_score = 10

        if 1.5 <= self.rem_sleep <= 2.5:
            rem_score = 100
        elif self.rem_sleep >= 1.0:
            rem_score = 70
        elif self.rem_sleep >= 0.5:
            rem_score = 40
        else:
            rem_score = 10

        if 12 <= self.respiratory_rate <= 16:
            resp_score = 100
        elif 10 <= self.respiratory_rate <= 18:
            resp_score = 70
        else:
            resp_score = 30

        return round(hrv_score * 0.25 + hr_score * 0.20 + deep_score * 0.25 + rem_score * 0.20 + resp_score * 0.10)

    def save(self, *args, **kwargs):
        self.score = self.calculate_score()
        if self.score >= 70:
            self.score_label = "good"
        elif self.score >= 45:
            self.score_label = "fair"
        else:
            self.score_label = "poor"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} — {self.date} — {self.score}"