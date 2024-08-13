import boto3
from django.core.files.storage import FileSystemStorage
import json
from .constants import *
from .models import *
import traceback
import os
from . import s3_details


# Create your views here.


def view_posts(request):
    """
        Summary: This method is used to fetch public posts.

        Request type: POST

        Parameters:
            request object

        Input JSON data:
            limit
            offset
            searchText
            sortBy
            sortType
            category

        Returns:
            dict object containing following information
                status
                noOfPosts
                message
                posts
    """
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            limit = collected_data.get("limit")
            offset = collected_data.get("offset")
            searchText = collected_data.get("searchText")
            sortby = collected_data.get("sortby")
            sort_type = collected_data.get("sortType")
            category = collected_data.get("category", "")

            data = find_post_data(limit, offset, searchText,
                                  sortby, sort_type, category)
            formatted_data = format_post_data(data)

            if data and len(data) > 0:
                return view_post_response('SUCCESS', 'Posts succesfully fetched.', formatted_data, len(data))

            else:
                return view_post_response('SUCCESS', 'No posts found with corresponding search text.', [], 0)

        return view_post_response('SUCCESS', 'This API has been called incorrectly. Needs to be POST method', [], 0)

    except Exception as e:
        print(traceback.print_exc())
        return view_post_response('FAILED', f'API failed with error: {e}', [], 0)


def format_post_data(post_list):
    """
    Summary: This method formats post data to a particular format
    """
    formatted_list = []
    cols = ['made_by', 'creation_date', 'no_likes', 'no_dislikes', 'points',
            'isReshared', 'post_id',  'no_views', 'no_comments', 'image', 'desc',
            'category']

    for each_post in post_list:
        post_dict = {}
        for ind, each_col in enumerate(cols):
            post_dict[each_col] = each_post[ind]

        formatted_list.append(post_dict)

    return formatted_list


def create_post(request):
    """
        Summary: This method is used to create a new post for any given user.

        Request type: POST

        Parameters:
            request object

        Input JSON data:
            username
            is_reshared
            description
            category
            image

        Returns:
            dict object containing following information
                status
                isPostCreated
                message
                postid
    """
    try:
        if request.method == 'POST':
            collected_data = request.POST
            username = collected_data['username']
            is_reshared = collected_data['is_reshared']
            description = collected_data['description']
            category = collected_data['category']

            try:
                image = request.FILES['image']
                s3_url = upload_image_to_s3(image)
            except:
                s3_url = collected_data['imageLink']

            tags = find_tags_from_description(description)

            post_id = create_post_in_db(
                username, is_reshared, description, s3_url, category)
            tags_added = add_tags_in_db(tags, post_id)

            if post_id and tags_added:
                create_post_ = insert_activity(
                    username, f"User created post {post_id}")
                return create_post_response('SUCCESS', 'Post succesfully created.', True, post_id)

            else:
                return create_post_response('SUCCESS', 'Something went wrong in post creation, please recheck.')

        return create_post_response('SUCCESS', 'This API has been called incorrectly. Needs to be POST method')

    except Exception as e:
        print(traceback.print_exc())
        return create_post_response('FAILED', f'API failed with error: {e}')


def upload_image_to_s3(image):
    """
    Summary: This method uploads image to s3 bucket
    """
    fs = FileSystemStorage()
    filename = fs.save(image.name, image)
    random_filename = "image_" + str(random.randint(1, 1000000)) + '.jpeg'

    s3 = boto3.client('s3', aws_access_key_id=s3_details.aws_access_key,
                      aws_secret_access_key=s3_details.aws_secret_key)
    response = s3.upload_file(
        filename, s3_details.bucket_name, random_filename)
    s3_url = s3_details.base_s3_url + random_filename

    os.remove(filename)
    return s3_url


def find_tags_from_description(description):
    """
    Summary: This method splits tags from entire description
    """
    tags = []
    textList = description.split()
    for i in textList:
        if (i[0] == "#"):
            x = i.replace("#", '')
            tags.append(x)

    return tags


def view_categories(request):
    """
        Summary: This method is used to view categories in which a post can be made

        Request type: GET

        Parameters:
            request object

        Input JSON data:
            no input data

        Returns:
            dict object containing following information
                status
                categories
                message
    """
    try:
        if request.method == 'GET':
            if categories:
                return view_categories_response('SUCCESS', 'Categories succesfully sent.', categories)

            else:
                return view_categories_response('SUCCESS', 'Something went wrong in fetching categories')

        return view_categories_response('SUCCESS', 'This API has been called incorrectly. Needs to be GET method')

    except Exception as e:
        print(traceback.print_exc())
        return view_categories_response('FAILED', f'API failed with error: {e}')


def view_user_posts(request):
    """
        Summary: This method is used to view posts made by a particular user.

        Request type: POST

        Parameters:
            request object

        Input JSON data:
            username
            limit
            offset
            searchText
            sortBy
            sortType

        Returns:
            dict object containing following information
                status
                posts
                message
                noOfPosts
    """
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            limit = collected_data.get("limit")
            offset = collected_data.get("offset")
            searchText = collected_data.get("searchText")
            sortby = collected_data.get("sortby")
            if not sortby or sortby == "":
                sortby = 'Creation_date'

            sort_type = collected_data.get("sortType")
            username = collected_data.get("username", "")

            data = find_user_post_data(
                limit, offset, searchText, sortby, sort_type, username)
            formatted_data = format_post_data(data)

            if data and len(data) > 0:
                return view_post_response('SUCCESS', 'Posts successfully fetched.', formatted_data, len(data))

            else:
                return view_post_response('SUCCESS', 'No posts found with corresponding search text.', [], 0)

        return view_post_response('SUCCESS', 'This API has been called incorrectly. Needs to be POST method', [], 0)

    except Exception as e:
        print(traceback.print_exc())
        return view_post_response('FAILED', f'API failed with error: {e}', [], 0)


def get_post_details(request):
    """
        Summary: This method is used to fetch details of a particular post

        Request type: POST

        Parameters:
            request object

        Input JSON data:
            postid

        Returns:
            dict object containing following information
                status
                post
                message
    """
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            postid = collected_data.get("postid")

            data = find_post_details(postid)
            cols = ['made_by', 'creation_date', 'no_likes', 'no_dislikes', 'points',
                    'isReshared', 'post_id', 'no_views', 'no_comments', 'image', 'desc',
                    'category']
            post_dict = {}
            for ind, each_col in enumerate(cols):
                post_dict[each_col] = data[ind]

            no_of_comments, comments = fetch_comments(postid)
            comments = format_comment_data(comments)
            post_dict['comments'] = comments

            if data and len(data) > 0:
                return view_single_post_response('SUCCESS', 'Post succesfully fetched.', post_dict)

            else:
                return view_single_post_response('SUCCESS', 'No posts found with corresponding search text.', {})

        return view_single_post_response('SUCCESS', 'This API has been called incorrectly. Needs to be POST method', {})

    except Exception as e:
        print(traceback.print_exc())
        return view_single_post_response('FAILED', f'API failed with error: {e}', {})


def like_dislike_post(request):
    """
        Summary: This method is used to like/dislike a given post.

        Request type: POST

        Parameters:
            request object

        Input JSON data:
            liked
            postid

        Returns:
            dict object containing following information
                status
                isUpdated
                message
                no_likes
                no_dislikes
    """
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            postid = collected_data.get("postid")
            liked = collected_data.get("liked")

            is_updated, data = like_dislike_post_db(postid, liked)

            if is_updated and data and len(data) > 0:
                return liked_disliked_response('SUCCESS', 'Post succesfully fetched.', True, data[0], data[1])

            else:
                return liked_disliked_response('SUCCESS', 'No posts found with corresponding search text.')

        return liked_disliked_response('SUCCESS', 'This API has been called incorrectly. Needs to be POST method')

    except Exception as e:
        print(traceback.print_exc())
        return liked_disliked_response('FAILED', f'API failed with error: {e}')


def add_comment(request):
    """
        Summary: This method is used to add a new comment to a given post

        Request type: POST

        Parameters:
            request object

        Input JSON data:
            username
            postid
            comment

        Returns:
            dict object containing following information
                status
                isCommentAdded
                message
                no_comments
                comments
    """
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            postid = collected_data.get("postid")
            comment = collected_data.get("comment")
            username = collected_data.get("username")

            is_updated, no_of_comments, comments = add_comment_to_db(
                postid, comment, username)
            comments = format_comment_data(comments)

            if is_updated and comments and len(comments) > 0:
                return add_comment_response('SUCCESS', 'Post succesfully fetched.', True, no_of_comments, comments)

            else:
                return add_comment_response('SUCCESS', 'No posts found with corresponding search text.')

        return add_comment_response('SUCCESS', 'This API has been called incorrectly. Needs to be POST method')

    except Exception as e:
        print(traceback.print_exc())
        return add_comment_response('FAILED', f'API failed with error: {e}')


def format_comment_data(data):
    """
    Summary: This method formats comment data to a particular format
    """
    formatted_list = []
    cols = ["comment_id", "username", "comment_time", "comment", "no_of_likes"]

    for each_post in data:
        post_dict = {}
        for ind, each_col in enumerate(cols):
            post_dict[each_col] = each_post[ind]

        formatted_list.append(post_dict)

    return formatted_list


def delete_comment(request):
    """
        Summary: This method is used to delete a given comment

        Request type: POST

        Parameters:
            request object

        Input JSON data:
            username
            postid
            commentid

        Returns:
            dict object containing following information
                status
                isCommentDeleted
                message
    """
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            postid = collected_data.get("postid")
            commentid = collected_data.get("commentid")
            username = collected_data.get("username")

            isdeleted = delete_comment_from_db(postid, commentid, username)

            if isdeleted:
                return delete_comment_response('SUCCESS', 'Comment deleted.', True)

            else:
                return delete_comment_response('SUCCESS', 'Something went wrong')

        return delete_comment_response('SUCCESS', 'This API has been called incorrectly. Needs to be POST method')

    except Exception as e:
        print(traceback.print_exc())
        return delete_comment_response('FAILED', f'API failed with error: {e}')


def add_view(request):
    """
        Summary: This method is used to update views for a given post

        Request type: POST

        Parameters:
            request object

        Input JSON data:
            postid

        Returns:
            dict object containing following information
                status
                isViewUpdated
                message
                postid
                noOfViews
    """
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            postid = collected_data.get("postid")

            is_updated, no_of_views = update_views(postid)

            if is_updated:
                return add_view_response('SUCCESS', 'Post succesfully fetched.', True, no_of_views, postid)

            else:
                return add_view_response('SUCCESS', 'No posts found with corresponding post id.')

        return add_view_response('SUCCESS', 'This API has been called incorrectly. Needs to be POST method')

    except Exception as e:
        print(traceback.print_exc())
        return add_view_response('FAILED', f'API failed with error: {e}')


def delete_post(request):
    """
        Summary: This method is used to delete a given post

        Request type: POST

        Parameters:
            request object

        Input JSON data:
            username
            postid

        Returns:
            dict object containing following information
                status
                isPostDeleted
                message
    """
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            postid = collected_data.get("postid")
            username = collected_data.get("username")

            isdeleted, image_path = delete_post_from_db(postid, username)

            is_deleted_from_s3 = False
            if image_path:
                is_deleted_from_s3 = delete_image_from_s3(image_path)

            if isdeleted and is_deleted_from_s3:
                return delete_post_response('SUCCESS', 'Post deleted.', True)

            else:
                return delete_post_response('SUCCESS', 'Something went wrong')

        return delete_post_response('SUCCESS', 'This API has been called incorrectly. Needs to be POST method')

    except Exception as e:
        print(traceback.print_exc())
        return delete_post_response('FAILED', f'API failed with error: {e}')


def delete_image_from_s3(image_path):
    """
    Summary: This method deletes image from the s3 bucket
    """
    s3 = boto3.client('s3', aws_access_key_id=s3_details.aws_access_key,
                      aws_secret_access_key=s3_details.aws_secret_key)
    response = s3.delete_object(Bucket=s3_details.bucket_name,
                                Key=image_path[38:])
    return True
