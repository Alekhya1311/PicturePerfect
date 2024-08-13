from django.shortcuts import render
import json
from .constants import *
from .models import *
import traceback

# Create your views here.


def edit_profile(request):
    """
        Summary: This method is used to edit profile of a given user.

        Request type: POST

        Parameters:
            request object

        Input JSON data:
            username
            updates which is a dict input

        Returns:
            dict object containing following information
                status
                isUpdated
                message
    """
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            username = collected_data.get("username")
            updates = collected_data.get("updates")

            data = update_profile(username, updates)

            if data:
                return edit_profile_response('SUCCESS', 'Profile updated succesfully', True)

            else:
                return edit_profile_response('SUCCESS', 'Username not found.', False)

        return edit_profile_response('SUCCESS', 'This API has been called incorrectly. Needs to be POST method', False)

    except Exception as e:
        print(traceback.print_exc())
        return edit_profile_response('FAILED', f'API failed with error: {e}', False)


def view_profile(request):
    """
        Summary: This method is used to fetch profile details of a given user.

        Request type: POST

        Parameters:
            request object

        Input JSON data:
            username

        Returns:
            dict object containing following information
                status
                message
                email
                dob
                username
                phonenum
                usertype
    """
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            username = collected_data.get("username")

            data = view_profile_data(username)
            processed_data = process_data(data)

            if data:
                return view_profile_response('SUCCESS', 'Profile found succesfully', processed_data)

            else:
                return view_profile_response('SUCCESS', 'Username not found.')

        return view_profile_response('SUCCESS', 'This API has been called incorrectly. Needs to be POST method')

    except Exception as e:
        print(traceback.print_exc())
        return view_profile_response('FAILED', f'API failed with error: {e}')


def process_data(data):
    """
    Summary: This method processes profile data to a required format.
    """
    data = list(data)
    data.pop(2)
    data.pop(2)
    data.pop(3)
    print(data)
    columns = ["name", "email", "dob", "username",
               "phonenum", "userpic", "about", "usertype"]
    processed_data = {}

    for i in range(len(data)):
        processed_data[columns[i]] = data[i]

    return processed_data


def get_activity_log(request):
    """
        Summary: This method is used to fetch activity log for a given user. It fetches
        the last 10 entries.

        Request type: POST

        Parameters:
            request object

        Input JSON data:
            username

        Returns:
            dict object containing following information
                status
                log
                message
                no_of_posts
    """
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            username = collected_data.get("username")

            data = fetch_activity_log(username)
            no_of_posts = get_no_of_posts(username)[0]
            data = process_log_data(data)

            if data:
                return view_activity_log_response('SUCCESS', 'Profile found succesfully', data, no_of_posts)

            else:
                return view_activity_log_response('SUCCESS', 'Username not found.')

        return view_activity_log_response('SUCCESS', 'This API has been called incorrectly. Needs to be POST method')

    except Exception as e:
        print(traceback.print_exc())
        return view_activity_log_response('FAILED', f'API failed with error: {e}')


def process_log_data(data):
    """
    Summary: This method processes log data to a required format
    """
    formatted_list = []
    cols = ['activity', 'activity_time']

    for activity in data:
        activity_dict = {}
        for ind, each_col in enumerate(cols):
            activity_dict[each_col] = activity[ind]

        formatted_list.append(activity_dict)

    return formatted_list
