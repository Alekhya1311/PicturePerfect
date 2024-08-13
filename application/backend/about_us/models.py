from django.db import models
import pymysql

# Create your models here.


def get_cursor():
    conn = pymysql.connect(
        host='127.0.0.1',
        port=3306,
        user='alekya',
        password='1234',
        db='team_db'
    )
    cursor = conn.cursor()
    return cursor, conn


def get_about_details():
    cursor, conn = get_cursor()
    cursor.execute('SELECT * FROM about_developers')
    details = cursor.fetchall()
    conn.close()
    return details
