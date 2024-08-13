"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os
from .env_details import *
from django.core.wsgi import get_wsgi_application

if env == 'local':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.backend.settings')

application = get_wsgi_application()
