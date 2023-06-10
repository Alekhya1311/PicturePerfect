from django.db import models
import pymysql

# Create your models here.

def get_about_details():
    conn = pymysql.connect(
        host='csc648-db-team-1.cp7px58ibcuh.us-east-1.rds.amazonaws.com',
        port=3306,
        user='adminuser',
        password='burritoman2023#',
        db='team1_database'
    )
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM about_developers')
    details = cursor.fetchall()
    conn.close()
    return details
