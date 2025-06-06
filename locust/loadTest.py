from locust import between
from base import BaseApiUser

class LoadUser(BaseApiUser):
    """
    User class for load testing. Inherits all tasks from BaseApiUser.
    Wait time is set to simulate a realistic user.
    """
    wait_time = between(1, 3)

## Command to run: locust -f loadTest.py --host http://localhost:3000