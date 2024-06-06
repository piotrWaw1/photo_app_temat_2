from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Photo
from .serializer import PhotoSerializer
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model

User = get_user_model()

class PhotoCreateAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client.force_authenticate(user=self.user)
        self.url_create = reverse('photo_create')
        self.url_delete = reverse('photo_delete', kwargs={'pk': 1})  

    def test_create_photo(self):
        """
        Test tworzenia nowego zdjęcia.
        """
        data = {'title': 'Test Photo'}
        with open('annotations/media/test_image.jpg', 'rb') as file:  
            response = self.client.post(self.url_create, {'image': file, **data}, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Photo.objects.filter(owner=self.user, title='Test Photo').exists())

    def test_create_photo_invalid_extension(self):
        """
        Test tworzenia nowego zdjęcia z nieprawidłowym rozszerzeniem pliku.
        """
        data = {'title': 'Invalid Photo'}
        with open('annotations/media/invalid_image.tif', 'rb') as file:  
            response = self.client.post(self.url_create, {'image': file, **data}, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid image file format')

    def test_create_photo_exceeds_size(self):
        """
        Test tworzenia nowego zdjęcia, które przekracza dozwolony rozmiar pliku.
        """
        data = {'title': 'Oversized Photo'}
        with open('annotations/media/oversized_image.jpg', 'rb') as file:  
            response = self.client.post(self.url_create, {'image': file, **data}, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Image file size exceeds 50000KB')

    def test_get_photos(self):
        """
        Test pobierania zdjęć użytkownika.
        """
        Photo.objects.create(owner=self.user, title='Test Photo', image='test_image.jpg')
        response = self.client.get(self.url_create)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Photo')


    def test_delete_photo(self):
        photo = Photo.objects.create(owner=self.user, title="Test Photo", image=SimpleUploadedFile(name='test_image.jpg', content=b'', content_type='image/jpeg'))
        photo_detail_url = reverse('photo_delete', kwargs={'pk': photo.pk})
        
        # Ensure photo exists before deleting
        self.assertTrue(Photo.objects.filter(pk=photo.pk).exists())

        response = self.client.delete(photo_detail_url)
        
        # Ensure photo is deleted
        self.assertFalse(Photo.objects.filter(pk=photo.pk).exists())

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_photo_not_found(self):
        response = self.client.delete(reverse('photo_delete', kwargs={'pk': 999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Photo not found')

    def test_delete_photo_no_permission(self):
        another_user = User.objects.create_user(username='anotheruser',
                                                 email='another@gmail.com',
                                                 password='anotherpass')
        photo = Photo.objects.create(owner=another_user, title="Another Photo", image=SimpleUploadedFile(name='another_image.jpg', content=b'', content_type='image/jpeg'))
        response = self.client.delete(reverse('photo_delete', kwargs={'pk': photo.pk}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('You do not have permission to delete this photo.', response.data['detail'])
# Create your tests here.
