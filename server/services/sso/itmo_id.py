import requests
from flask import request

from server import info_logger
from server.services.sso.env_params import client_id, client_secret, redirect_uri


class ItmoId:
    @staticmethod
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

    @staticmethod
    def get_access_token():
        code = ItmoId.get_code_auth()
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
        # !TODO тут вроде бы jwt. надо сохранить у клиента
        # access_token = ""
        # max_age = 24 * 60 * 60  # 10 years
        # expires = datetime.datetime.utcnow() + datetime.timedelta(seconds=max_age)
        # response = make_response("Here, take some cookie!")
        # response.set_cookie(key="access_token", value=access_token, expires=expires, httponly=True)
        return response

    @staticmethod
    def get_pub_keys():

        address = "https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/certs"

        response = requests.get(address)
        print("pub_keys:", response.content.decode())
        return response.content.decode()


# if __name__ == "__main__":
    # ItmoId.get_access_token()
    # ItmoId.get_code_auth()
    # ItmoId.get_pub_keys()
