# from django.conf.urls import url
from django.urls import path, include, re_path
from .views import *

app_name = 'users'

urlpatterns = [
    re_path(r'^update_user_profile$', edit_profile, name='edit_profile'),
    re_path(r'^view_user_profile$', view_profile, name='view_profile'),
    re_path(r'^activity_log$', get_activity_log, name='activity_log')
]
