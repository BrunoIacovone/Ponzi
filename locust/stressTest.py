from locust import HttpUser, task, between; 
from locust import tag
from dotenv import load_dotenv
import requests
import os

load_dotenv()

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

# print (API_KEY)
# print(resp.content)
# print(id_token)
#
# if not id_token:
#     print("Error: No se pudo obtener el id_token. Revisá las credenciales y el API_KEY.")
#     exit(1)
# print("TOKEN:", id_token)

class PonziUser(HttpUser):
    wait_time = between(1, 3)
    token = id_token

    @task(20)
    def get_balance(self):
        self.client.get(
            "/api/balance",
            headers={"Authorization": f"Bearer {self.token}"}
        )

    @task(20)
    @tag('transactions')
    def get_transactions(self):
        self.client.get(
            "/api/transactions",
            headers={"Authorization": f"Bearer {self.token}"}
        )

    @task(10)
    def add_funds(self):
        self.client.post(
            "/api/add-funds",
            json={"amount": 10},
            headers={"Authorization": f"Bearer {self.token}"}
        )

    @task(10)
    def send_money(self):
        # Cambiá recipientMail por un usuario válido de prueba
        self.client.post(
            "/api/send-money",
            json={"recipientMail": "mark@mail.com", "amount": 5},
            headers={"Authorization": f"Bearer {self.token}"}
        )

##Para ejecutar usar: locust -f stressTest.py --host http://localhost:3000