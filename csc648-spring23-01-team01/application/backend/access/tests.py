from django.test import TestCase


# Create your tests here.


class AccessTestCases(TestCase):
    def test_successful_login(self):
        input_payload = {
            "username": "testuser",
            "password": "TestUserPass123#",
            "user_type": "general"
        }

        print("Testing valid login case")
        response = self.client.post(
            '/user_login', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['isLoggedin'], True)

    def test_invalid_login(self):
        input_payload = {
            "username": "testuser",
            "password": "incorrect password",
            "user_type": "general"
        }

        response = self.client.post(
            '/user_login', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['isLoggedin'], False)

    def test_valid_signup(self):
        input_payload = {
            "username": "Bob",
            "name": "Bob",
            "password": "Validpassword1!",
            "email": "totallyvalid@gmail.com",
            "phonenum": "0123456789",
            "dob": "01-01-0001",
            "userpic": "fakepic",
            "about": "mindyobidniss",
            "usertype": "random",

        }
        response = self.client.post(
            '/register_user', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(
            response.json()['message'], 'Welcome to PicturePerfect Bob')
        self.assertEqual(response.json()['isRegistered'], True)

        input_payload_delete = {
            "username": input_payload['username']
        }
        response = self.client.post('/delete_user', input_payload_delete, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['isDeleted'], True)

    def test_invalid_password_signup(self):
        print("Testing register API")
        input_payload = {
            "username": "Bob",
            "name": "Bob",
            "password": "invalidpassword",
            "email": "totallyvalid@gmail.com",
            "phonenum": "0123456789",
            "dob": "01-01-0001",
            "userpic": "fakepic",
            "about": "mindyobidniss",
            "usertype": "random",
        }
        response = self.client.post(
            '/register_user', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['isRegistered'], False)

    def test_invalid_phonenum_signup(self):
        input_payload = {
            "username": "Bob",
            "name": "Bob",
            "password": "Validpassword1!",
            "email": "alsoatotallyvalid@gmail.com",
            "phonenum": "404",
            "dob": "01-01-0001",
            "userpic": "fakepic",
            "about": "mindyobidniss",
            "usertype": "random",
        }
        response = self.client.post(
            '/register_user', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['message'], 'Invalid phone number')
        self.assertEqual(response.json()['isRegistered'], False)

    def test_invalid_email_signup(self):
        input_payload = {
            "username": "Bob",
            "name": "Bob",
            "password": "Validpassword1!",
            "email": "invalidemail",
            "phonenum": "0123456789",
            "dob": "01-01-0001",
            "userpic": "fakepic",
            "about": "mindyobidniss",
            "usertype": "random",
        }
        response = self.client.post(
            '/register_user', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['message'], 'Invalid email')
        self.assertEqual(response.json()['isRegistered'], False)

    def test_successful_logout(self):
        input_payload = {
            "username": "testuser"
        }

        print("Testing logout API with valid ouput")
        response = self.client.post(
            '/logout', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['isLoggedout'], True)
