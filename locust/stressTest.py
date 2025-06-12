from locust import between
from base import BaseApiUser

class StressUser(BaseApiUser):
    """
    User class for stress testing. Inherits all tasks from BaseApiUser.
    Wait time is set to almost zero to generate maximum load.
    """
    wait_time = between(0, 1)

## Command to run: locust -f stressTest.py --host http://localhost:3000