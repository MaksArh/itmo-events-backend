import os
from os import environ
from dotenv import load_dotenv

import requests
from flask import request
from functools import wraps

from server import info_logger, error_logger
from server.services.jwt_verify import verify


dotenv_path = os.path.join(os.path.dirname(__file__), '../../.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

client_id = environ.get("CLIENT_ID")
client_secret = environ.get("CLIENT_SECRET")

redirect_uri = environ.get("REDIRECT_URI")

jwt_verify = bool(int(environ.get("JWT_VERIFY", 1)))


def check_auth(handle):

    @wraps(handle)
    def handle_work(*args, **kwargs):
        access_token = request.cookies.get("access_token")
        if not access_token:
            access_token = get_access_token()

        print("access_token", access_token, "\nfunk_name:", handle.__name__)
        if jwt_verify:
            stat = verify(access_token)
            if stat["status"] == "ok":
                payload = stat["payload"]
            else:
                return stat["status"], 404

        return handle(*args, **kwargs)

    return handle_work


def get_code_auth():
    data = {
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": "openid profile email",
    }

    address = "https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/auth"

    print(data)
    response = requests.get(address, params=data)
    print("url", response.url)
    print("get_code_auth", response.status_code)
    if response.status_code == 200:
        code = response.json()["code"]
        print("------", code)
        print("------", request.args.get("code"))
        return code
    else:
        info_logger.error("Problems with getting code for auth")
        raise "Problems with getting code for auth"


def get_access_token():
    code = get_code_auth()
    data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri,
        "code": code,
    }

    address = "https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/token"

    response = requests.post(address, data=data)
    print(response.content)

    return response


# if __name__ == "__main__":
#     # get_access_token()
#     get_code_auth()
