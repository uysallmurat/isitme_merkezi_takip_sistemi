from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

class HearingTestsApiTests(APITestCase):
    def test_sample(self):
        # Bu test, hearing_tests API'si için örnek bir testtir.
        # İleride gerçek endpointler eklendiğinde güncellenecek.
        self.assertEqual(1, 1)