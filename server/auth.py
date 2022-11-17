import requests
from flask import request
from functools import wraps


def check_auth(handle):
    # 1) receive FWT from front
    # 2) check in db
    @wraps(handle)
    def handle_work(*args, **kwargs):
        print("lol")
        return handle(*args, **kwargs)

    return handle_work


def get_code_auth():
    data = {"client_id": "itmo-print",
            "response_type": "code",
            "redirect_uri": "http://127.0.0.1:8080/health_app",
            "scope": "openid profile email",
            }

    address = "https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/auth"

    response = requests.get(address, params=data)
    print(response.content)

    code = response.json()["code"]
    request.args.get("code")
    return response

