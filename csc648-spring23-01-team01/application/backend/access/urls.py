# from django.conf.urls import url
from django.urls import re_path

from .views import *

app_name = 'access'

urlpatterns = [
    re_path(r'^user_login$', login, name='login'),
    re_path(r'^register_user$', register, name='register'),
    re_path(r'^login$', render_index_page, name='render_login'),
    re_path(r'^signup$', render_index_page, name='render_register'),
    re_path(r'^$', render_index_page, name='render_homepage'),
    re_path(r'^logout$', logout, name='logout'),
    re_path(r'^user-profile$', render_index_page, name='user-profile'),
    re_path(r'^edit-profile$', render_index_page, name='edit-profile'),
    re_path(r'^uploadimage$', render_index_page, name='upload_image'),
    re_path(r'^delete_user$', delete_user, name='delete_user'),
]

handler404 = "access.views.handle_404_view"
