from django.test import TestCase
import random

# Create your tests here.


class UsersTestCases(TestCase):
    def test_successful_update_user_profile(self):
        view_profile_input_payload = {
            "username": "testuser"
        }

        random_email = "testuser{}@gmail.com".format(str(random.randint(0, 1000)))
        update_profile_input_payload = {
            "username": view_profile_input_payload['username'],
            "updates": [
                {"updatedColumn": "name", "updatedValue": "Test User"},
                {"updatedColumn": "email", "updatedValue": random_email}
            ]
        }

        print("Testing update user profile API")

        # update user profile
        update_profile_response = self.client.post('/update_user_profile', update_profile_input_payload, content_type='application/json')
        self.assertEqual(update_profile_response.json()['status'], 'SUCCESS')
        self.assertEqual(update_profile_response.json()['isUpdated'], True)

        # getting updated profile details
        updated_profile_response = self.client.post('/view_user_profile', view_profile_input_payload, content_type='application/json')
        self.assertEqual(updated_profile_response.json()['status'], 'SUCCESS')

        # checking if profile is updated correctly
        self.assertEqual(updated_profile_response.json()['name'], update_profile_input_payload['updates'][0]['updatedValue'])
        self.assertEqual(updated_profile_response.json()['email'], update_profile_input_payload['updates'][1]['updatedValue'])

    def test_successful_activity_log(self):
        input_payload = {
            "username": "testuser",

        }

        print("Testing activity log API")

        activity_log_response = self.client.post('/activity_log', input_payload, content_type='application/json')
        self.assertEqual(activity_log_response.json()['status'], 'SUCCESS')
        self.assertEqual(activity_log_response.json()['message'],'Profile found succesfully')

    def test_successful_view_user_profile(self):
        input_payload = {
            "username": "testuser",
        }

        print("Testing view user profile API")

        view_user_profile_response = self.client.post('/view_user_profile', input_payload, content_type='application/json')
        self.assertEqual(view_user_profile_response.json()['status'], 'SUCCESS')
        self.assertEqual(view_user_profile_response.json()['username'], input_payload['username'])
