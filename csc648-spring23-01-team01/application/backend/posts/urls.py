# from django.conf.urls import url
from django.urls import path, include, re_path
from .views import *

app_name = 'posts'

urlpatterns = [
    re_path(r'^view_public_posts$', view_posts, name='view_posts'),
    re_path(r'^create_post$', create_post, name='create_post'),
    re_path(r'^fetch_categories$', view_categories, name='fetch_categories'),
    re_path(r'^list_user_posts$', view_user_posts, name='view_user_posts'),
    re_path(r'^get_post_details$', get_post_details, name='get_post_details'),
    re_path(r'^like_dislike_post$', like_dislike_post, name='like_dislike_post'),
    re_path(r'^add_comment$', add_comment, name='add_comment'),
    re_path(r'^delete_comment$', delete_comment, name='delete_comment'),
    re_path(r'^add_view$', add_view, name='add_view'),
    re_path(r'^delete_post$', delete_post, name='delete_post'),
]
