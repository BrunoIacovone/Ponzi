from locust import HttpUser, task, between
import requests
import os

API_KEY = os.getenv("api_key")  # Asegúrate de que la variable de entorno
email = os.getenv("email")  # Asegúrate de que la variable de entorno
password = os.getenv("password")  # Asegúrate de que la variable de entorno

url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
payload = {
    "email": email,
    "password": password,
    "returnSecureToken": True
}

resp = requests.post(url, json=payload)
id_token = resp.json().get("idToken")

class PonziUser(HttpUser):
    wait_time = between(1, 3)
    token = id_token

    @task
    def get_balance(self):
        self.client.get(
            "/api/balance",
            headers={"Authorization": f"Bearer {self.token}"}
        )

    @task
    def get_transactions(self):
        self.client.get(
            "/api/transactions",
            headers={"Authorization": f"Bearer {self.token}"}
        )

    @task
    def add_funds(self):
        self.client.post(
            "/api/add-funds",
            json={"amount": 10},
            headers={"Authorization": f"Bearer {self.token}"}
        )

    @task
    def send_money(self):
        # Cambiá recipientMail por un usuario válido de prueba
        self.client.post(
            "/api/send-money",
            json={"recipientMail": "mark@mail.com", "amount": 5},
            headers={"Authorization": f"Bearer {self.token}"}
        )

##Para ejecutar usar: locust -f stressTest.py --host http://localhost:3000