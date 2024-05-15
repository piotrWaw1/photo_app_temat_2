from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group


def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)


class Photo(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_photos')
    # groups = models.ManyToManyField(Group, related_name='group_photos')
    image = models.ImageField(upload_to='photos/', blank=True, null=True)
    title = models.CharField(max_length=100, blank=False, null=False)
    uploaded_on = models.DateTimeField(auto_now_add=True)
    image_url = models.ImageField(upload_to=upload_to, blank=True, null=True)


class Annotation(models.Model):
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name='annotations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)