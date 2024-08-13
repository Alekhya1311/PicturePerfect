# from django.conf.urls import url
from django.urls import path, include, re_path
from .views import *

app_name = 'about_us'

urlpatterns = [
    re_path('^$', render_about, name='about_home')
]
