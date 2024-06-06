from django.contrib import admin
from django.contrib.auth.models import User
from .models import Group, Photo, Annotation


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ("name", "owner")
    search_fields = ("name", "owner__username")
    filter_horizontal = ("members",)


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "uploaded_on")
    search_fields = ("title", "owner__username")
    list_filter = ("uploaded_on",)
    filter_horizontal = ("groups",)


@admin.register(Annotation)
class AnnotationAdmin(admin.ModelAdmin):
    list_display = ("photo", "user", "created_at")
    search_fields = ("photo__title", "user__username", "text")
    list_filter = ("created_at",)
