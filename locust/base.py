import os
import random
from locust import HttpUser, task
from dotenv import load_dotenv
import requests

load_dotenv()

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

users = []
for i in range(1, 210):
    users.append({"email": f"locust{i}@mail.com", "password": f"locust{i}"})

API_KEY = os.getenv("api_key")
SENDER_USERS = users
RECEIVER_EMAILS = get_emails_from_env("RECEIVER")

if not API_KEY or not SENDER_USERS or not RECEIVER_EMAILS:
    print("Error: Ensure API_KEY, SENDER users, and RECEIVER emails are in your .env file.")
    exit(1)

TOKENS = []

def preload_tokens():
    global TOKENS
    print("Preloading tokens...")
    for creds in SENDER_USERS:
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
        payload = {
            "email": creds["email"],
            "password": creds["password"],
            "returnSecureToken": True,
        }
        try:
            res = requests.post(url, json=payload)
            if res.status_code == 200:
                TOKENS.append(res.json()["idToken"])
            else:
                print(f"Failed to get token for {creds['email']}, {creds['password']}: {res.status_code} {res.text}")
        except Exception as e:
            print(f"Exception logging in {creds['email']}: {e}")
    print(f"Loaded {len(TOKENS)} tokens.")


preload_tokens()

class BaseApiUser(HttpUser):
    abstract = True

    def on_start(self):
                if not TOKENS:
                    print("No tokens available.")
                    self.environment.runner.stop()
                    return
                self.token = random.choice(TOKENS)

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

    @task(10)
    def add_funds(self):
        """Adds funds from a random bank account (simulated by a receiver email)."""
        bank_email = random.choice(RECEIVER_EMAILS)
        with self.client.post(
            "/api/debin",
            headers=self._get_auth_headers(),
            json={"amount": 10, "bankEmail": bank_email},
            name="/api/debin",
            catch_response=True
        ) as response:
            if response.status_code == 500 and 'Insufficient funds' in response.text:
                response.success()
            elif response.status_code >= 400:
                response.failure(f"Unexpected error: {response.status_code} {response.text}")

    @task(10)
    def send_money(self):
        """Sends money from the current SENDER to a random RECEIVER."""
        recipient = random.choice(users)
        with self.client.post(
            "/api/send-money",
            json={"recipientMail": recipient["email"], "amount": 5},
            headers=self._get_auth_headers(),
            name="/api/send-money",
            catch_response=True
        ) as response:
            if response.status_code == 400 and 'Insufficient funds' in response.text:
                response.success()
            elif response.status_code >= 400:
                response.failure(f"Unexpected error: {response.status_code} {response.text}")
