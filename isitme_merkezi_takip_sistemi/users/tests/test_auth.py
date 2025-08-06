from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User

class UserAuthTests(APITestCase):
    def test_register(self):
        url = reverse('register')
        data = {
            'username': 'apitestuser',
            'email': 'apitest@example.com',
            'password': 'testpassword123',
            'first_name': 'Api',
            'last_name': 'Test'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.filter(username='apitestuser').exists(), True)

    def test_login(self):
        User.objects.create_user(username='apitestuser2', password='testpassword123')
        url = reverse('token_obtain_pair')
        data = {
            'username': 'apitestuser2',
            'password': 'testpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)