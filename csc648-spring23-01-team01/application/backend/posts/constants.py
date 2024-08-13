from django.http import JsonResponse

categories = ['Nature', 'Trip', 'Sports', 'Fashion',
              'Funny', 'Games', 'Space', 'Movies',
              'Crafts', 'Music', 'Art']


def view_post_response(status="SUCCESS", message="", posts=[], count=0):
    # This method is a constant definition of response expected for view posts API
    view_post_response_obj = {
        'status': status,
        'message': message,
        "posts": posts,
        "noOfPosts": count
    }

    return JsonResponse(view_post_response_obj)


def create_post_response(status="SUCCESS", message="", is_post_created=False, post_id=''):
    # This method is a constant definition of response expected for create post API
    create_post_response_obj = {
        'status': status,
        'message': message,
        "isPostCreated": is_post_created,
        "postid": post_id
    }

    return JsonResponse(create_post_response_obj)


def view_categories_response(status="SUCCESS", message="", categories=[]):
    # This method is a constant definition of response expected for view categories API
    view_categories_response_obj = {
        'status': status,
        'message': message,
        "categories": categories
    }

    return JsonResponse(view_categories_response_obj)


def view_single_post_response(status="SUCCESS", message="", posts={}):
    # This method is a constant definition of response expected for view post API
    view_single_post_response_obj = {
        'status': status,
        'message': message,
        "post": posts
    }

    return JsonResponse(view_single_post_response_obj)


def liked_disliked_response(status="SUCCESS", message="", isupdated=False, no_likes=0, no_dislikes=0):
    # This method is a constant definition of response expected for like dislike API
    liked_disliked_response_obj = {
        'status': status,
        'message': message,
        "isUpdated": isupdated,
        "no_likes": no_likes,
        "no_dislikes": no_dislikes
    }

    return JsonResponse(liked_disliked_response_obj)


def add_comment_response(status="SUCCESS", message="", iscommentadded=False, no_comments=0, comments=[]):
    # This method is a constant definition of response expected for add comment API
    add_comment_response_obj = {
        'status': status,
        'message': message,
        "isCommentAdded": iscommentadded,
        "no_comments": no_comments,
        "comments": comments
    }

    return JsonResponse(add_comment_response_obj)


def delete_comment_response(status="SUCCESS", message="", isdeleted=False):
    # This method is a constant definition of response expected for delete comment API
    delete_comment_response_obj = {
        'status': status,
        'message': message,
        "isCommentDeleted": isdeleted,
    }

    return JsonResponse(delete_comment_response_obj)


def add_view_response(status="SUCCESS", message="", isviewupdated=False, no_views=0, postid=""):
    # This method is a constant definition of response expected for add view API
    add_view_response_obj = {
        'status': status,
        'message': message,
        "isViewUpdated": isviewupdated,
        "noOfViews": no_views,
        "postid": postid
    }

    return JsonResponse(add_view_response_obj)


def delete_post_response(status="SUCCESS", message="", isdeleted=False):
    # This method is a constant definition of response expected for delete post API
    delete_post_response_obj = {
        'status': status,
        'message': message,
        "isPostDeleted": isdeleted,
    }

    return JsonResponse(delete_post_response_obj)
