"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from .env_details import *
from .views import *

if env == 'local':
    urlpatterns = [
        path('admin/', admin.site.urls),
        path(r'about/', include('about_us.urls')),
        path(r'', include('access.urls')),
        path(r'', include('posts.urls')),
        path(r'', include('users.urls')),
        re_path(r'^.*$', render_index_page, name='delete_post'),
    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    urlpatterns = [
          path('admin/', admin.site.urls),
          path(r'about/', include('backend.about_us.urls')),
          path(r'', include('backend.access.urls')),
          path(r'', include('backend.posts.urls')),
          path(r'', include('backend.users.urls')),
      ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)