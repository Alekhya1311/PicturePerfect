FROM python:3.9-slim-buster
WORKDIR /app
#RUN rm -r -f .
COPY ./ ./

RUN pip install --upgrade pip --no-cache-dir

RUN pip install -r requirements.txt --no-cache-dir

CMD ["sudo", "apt", "update"]

CMD ["sudo", "apt", "install", "nodejs", "npm"]

WORKDIR /frontend/

CMD ["npm", "install"]
#CMD ["npm", "install", "react-scripts", "--save"]
#CMD ["npm", "run", "build"]

WORKDIR /app

RUN ls /app
#RUN  ls application/frontend/build/static/css

#WORKDIR /backend

RUN ls /app/backend

CMD ["python3", "backend/manage.py", "collectstatic"]

#CMD ["python3", "backend/manage.py", "runserver", "0.0.0.0:8000"]


CMD ["gunicorn", "backend.backend.wsgi:application", "--bind", "0.0.0.0:8000", "--timeout", "90"]

#WORKDIR /app
