from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import SleepLog
from datetime import date

User = get_user_model()

class SleepLogScoreTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

    def test_good_score(self):
        log = SleepLog.objects.create(
            user=self.user, date=date.today(),
            sleep_hours=8, sleep_quality=9,
            resting_hr=54, hrv=74,
            stress=18, steps_yesterday=10000,
            calories_yesterday=2200
        )
        self.assertGreaterEqual(log.score, 70)
        self.assertEqual(log.score_label, "good")

    def test_poor_score(self):
        log = SleepLog.objects.create(
            user=self.user, date=date(2026, 1, 1),
            sleep_hours=4, sleep_quality=3,
            resting_hr=78, hrv=25,
            stress=85, steps_yesterday=2000,
            calories_yesterday=1400
        )
        self.assertLess(log.score, 45)
        self.assertEqual(log.score_label, "poor")