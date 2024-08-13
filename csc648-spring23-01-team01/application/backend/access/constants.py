from django.http import JsonResponse


def login_response(status="SUCCESS", isloggedin=False, message="", userid=""):
    # This method is a constant definition of response expected for login API
    login_response_obj = {
        'status': status,
        'isLoggedin': isloggedin,
        'message': message,
        "userId": userid
    }

    return JsonResponse(login_response_obj)


def delete_user_response(status="SUCCESS", message="", isdeleted=False):
    # This method is a constant definition of response expected for delete user API
    delete_response_obj = {
        'status': status,
        'isDeleted': isdeleted,
        'message': message
    }

    return JsonResponse(delete_response_obj)


def register_response(status="SUCCESS", isRegistered=False, message="", isUnique=False):
    # This method is a constant definition of response expected for register API
    register_response_obj = {
        'status': status,
        'isRegistered': isRegistered,
        'message': message,
        'isUnique': isUnique,
    }

    return JsonResponse(register_response_obj)


def logout_response(status="SUCCESS", message="", isloggedout=False):
    # This method is a constant definition of response expected for logout API
    logout_response_obj = {
        'status': status,
        'message': message,
        'isLoggedout': isloggedout,
    }

    return JsonResponse(logout_response_obj)
