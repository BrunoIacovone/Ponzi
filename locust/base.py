import os
import random
from locust import HttpUser, task
from dotenv import load_dotenv

load_dotenv()

def get_users_from_env(prefix):
    """Loads users based on a prefix (e.g., 'SENDER') from .env variables."""
    users = []
    i = 1
    while True:
        email = os.getenv(f"{prefix}_EMAIL_{i}")
        password = os.getenv(f"{prefix}_PASSWORD_{i}")
        if email and password:
            users.append({"email": email, "password": password})
            i += 1
        else:
            break
    return users

def get_emails_from_env(prefix):
    """Loads emails based on a prefix (e.g., 'RECEIVER') from .env variables."""
    emails = []
    i = 1
    while True:
        email = os.getenv(f"{prefix}_EMAIL_{i}")
        if email:
            emails.append(email)
            i += 1
        else:
            break
    return emails

API_KEY = os.getenv("api_key")
SENDER_USERS = get_users_from_env("SENDER")
RECEIVER_EMAILS = get_emails_from_env("RECEIVER")

if not API_KEY or not SENDER_USERS or not RECEIVER_EMAILS:
    print("Error: Ensure API_KEY, SENDER users, and RECEIVER emails are in your .env file.")
    exit(1)

class BaseApiUser(HttpUser):
    abstract = True

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.token = None
        # Each virtual user is a random sender
        self.test_user_credentials = random.choice(SENDER_USERS)

    def on_start(self):
        """Executed when a virtual user starts. Performs login for a SENDER."""
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
        payload = {
            "email": self.test_user_credentials["email"],
            "password": self.test_user_credentials["password"],
            "returnSecureToken": True,
        }
        
        with self.client.post(url, json=payload, name="/v1/accounts:signInWithPassword", catch_response=True) as response:
            if response.status_code == 200:
                self.token = response.json().get("idToken")
            else:
                response.failure(f"Could not get token for {self.test_user_credentials['email']}. Status: {response.status_code}, Body: {response.text}")

    def _get_auth_headers(self):
        if not self.token:
            print(f"User {self.test_user_credentials['email']} has no token.")
            self.environment.runner.stop()
            return {}
        return {"Authorization": f"Bearer {self.token}"}

    @task(20)
    def get_balance(self):
        self.client.get("/api/balance", headers=self._get_auth_headers(), name="/api/balance")

    @task(20)
    def get_transactions(self):
        self.client.get("/api/transactions", headers=self._get_auth_headers(), name="/api/transactions")

    @task(5)
    def add_funds(self):
        """Adds funds from a random bank account (simulated by a receiver email)."""
        bank_email = random.choice(RECEIVER_EMAILS)
        self.client.post(
            "/api/debin",
            headers=self._get_auth_headers(),
            json={"amount": 10, "bankEmail": bank_email},
            name="/api/debin"
        )

    @task(10)
    def send_money(self):
        """Sends money from the current SENDER to a random RECEIVER."""
        recipient = random.choice(RECEIVER_EMAILS)
        self.client.post(
            "/api/send-money",
            json={"recipientMail": recipient, "amount": 5},
            headers=self._get_auth_headers(),
            name="/api/send-money"
        ) 