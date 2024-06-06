from django.urls import reverse
from log_reg.models import User
from rest_framework import status
from rest_framework.test import APITestCase

# Testy dla serializatora UserSerializer
from .serializers import UserSerializer

class UserSerializerTest(APITestCase):
    def setUp(self):
        self.valid_user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password123'
        }

    def test_create_user(self):
        serializer = UserSerializer(data=self.valid_user_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()

        self.assertEqual(user.username, self.valid_user_data['username'])
        self.assertEqual(user.email, self.valid_user_data['email'])
        self.assertTrue(user.check_password(self.valid_user_data['password']))

    def test_password_is_write_only(self):
        serializer = UserSerializer(data=self.valid_user_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        
        serialized_user = UserSerializer(user).data
        self.assertNotIn('password', serialized_user)

    def test_missing_username(self):
        invalid_data = self.valid_user_data.copy()
        invalid_data.pop('username')

        serializer = UserSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)

    def test_missing_password(self):
        invalid_data = self.valid_user_data.copy()
        invalid_data.pop('password')

        serializer = UserSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)

    def test_create_user_with_existing_username(self):
        User.objects.create(username='testuser', email='existing@example.com', password='password123')
        serializer = UserSerializer(data=self.valid_user_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)

# Testy dla widoków RegisterView i LoginView

class UserAuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.token_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password123'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_register_user(self):
        response = self.client.post(self.register_url, {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], 'newuser')
        self.assertEqual(response.data['email'], 'newuser@example.com')
        self.assertNotIn('password', response.data)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_user_with_existing_email(self):
        response = self.client.post(self.register_url, {
            'username': 'anotheruser',
            'email': 'test@example.com',  # existing email
            'password': 'newpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user(self):
        response = self.client.post(self.token_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_user_with_incorrect_password(self):
        response = self.client.post(self.token_url, {
            'email': self.user_data['email'],
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_login_user_with_non_existent_email(self):
        response = self.client.post(self.token_url, {
            'email': 'nonexistent@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_refresh_token(self):
        login_response = self.client.post(self.token_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        refresh_token = login_response.data['refresh']

        response = self.client.post(self.refresh_url, {
            'refresh': refresh_token
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)