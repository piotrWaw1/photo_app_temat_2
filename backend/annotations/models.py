from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework.exceptions import PermissionDenied

def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)


class Group(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_groups')
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='member_groups')

    def __str__(self):
        return f"id:{self.id}, name:{self.name}"

class Photo(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_photos')
    groups = models.ManyToManyField(Group, related_name='group_photos')
    image = models.ImageField(upload_to='photos/', blank=True, null=True)
    title = models.CharField(max_length=100, blank=False, null=False)
    uploaded_on = models.DateTimeField(auto_now_add=True)
    # image_url = models.ImageField(upload_to=upload_to, blank=True, null=True)

    def __str__(self):
        return self.title

class Annotation(models.Model):
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name='annotations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.photo.owner == self.user:
            super().save(*args, **kwargs)
            return

        if self.photo.groups.exists() and not self.photo.groups.filter(members=self.user).exists():
            raise PermissionDenied("User does not have permission to annotate this photo")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Annotation by {self.user} on {self.photo}"
