from django.db import models
import pymysql


# Create your models here.


def get_cursor():
    # This method creates a connection to the MySQL Database

    conn = pymysql.connect(
        host='127.0.0.1',
        port=3306,
        user='alekya',
        password='1234',
        db='team_db'
    )
    cursor = conn.cursor()
    return cursor, conn


def update_profile(username, updates):
    # This method updates profile data for a given user

    try:
        cursor, conn = get_cursor()
        sql_statement = f"""Update User
                            SET """
        for each_update in updates:
            sql_statement += f"{each_update['updatedColumn']} = '{each_update['updatedValue']}'"
            if each_update != updates[-1]:
                sql_statement += ", "

        sql_statement += f" WHERE Username='{username}'"

        cursor.execute(sql_statement)
        conn.commit()
        conn.close()
        return True

    except:
        return False


def view_profile_data(username):
    # This method fetches profile data for a given user

    cursor, conn = get_cursor()
    sql_statement = f"""SELECT * FROM User WHERE Username='{username}'"""

    cursor.execute(sql_statement)
    data = cursor.fetchone()
    conn.close()
    return data


def fetch_activity_log(username):
    # This method fetches activity log for a given user

    cursor, conn = get_cursor()
    sql_statement = f"""SELECT activity, activity_time FROM activity_log 
                        WHERE username='{username}' ORDER BY activity_time DESC LIMIT 10"""

    cursor.execute(sql_statement)
    data = cursor.fetchall()
    conn.close()
    return data


def get_no_of_posts(username):
    # This method fetches the number of posts for a given user

    cursor, conn = get_cursor()
    sql_statement = f"""SELECT COUNT(*) FROM Posts WHERE Made_by='{username}'"""

    cursor.execute(sql_statement)
    data = cursor.fetchone()
    conn.close()
    return data
