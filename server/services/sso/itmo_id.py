import requests
from flask import redirect

from server.services.sso.env_params import client_id, client_secret, redirect_uri, post_logout_redirect_uri, scope


class ItmoId:

    @staticmethod
    def get_code_auth():
        """
        Получение кода авторизации
        GET https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/auth
        """

        address = "https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/auth"
        address += f"?client_id={client_id}" \
                   f"&response_type='code'" \
                   f"&redirect_uri={redirect_uri}" \
                   f"&scope={scope}"

        return redirect(location=address, code=302)

    @staticmethod
    def get_access_token(code: str):
        """
        Получение Access Token
        POST https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/token
        """

        address = "https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/token"
        address += f"?client_id={client_id}" \
                   f"&client_secret={client_secret}" \
                   f"&grant_type='authorization_code'" \
                   f"&redirect_uri={redirect_uri}" \
                   f"&code={code}"

        return redirect(location=address, code=302)

    @staticmethod
    def get_user_info():
        """         TODO: НЕ СРАБОТАЛО(
        Получение информации о пользователе по эндпоинту
        GET https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/userinfo
        Header: Authorization=Bearer ${access_token}
        """

        address = "https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/userinfo"
        access_token = ""

        response = requests.get(address, headers={"Authorization": f"Bearer {access_token}"})
        print(response.status_code)
        print(response.headers)
        return response.content.decode()

    @staticmethod
    def get_pub_keys():
        """
        Получение публичных ключей
        GET https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/certs
        """

        address = "https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/certs"

        response = requests.get(address)
        print("pub_keys:", response.content.decode())
        return response.content.decode()

    @staticmethod
    def leave_sso():
        """
        Выход из SSO
        GET https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/logout
        """
        address = "https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/logout"

        data = {
            "client_id": client_id,
            "post_logout_redirect_uri": post_logout_redirect_uri
        }
        response = requests.get(address, params=data)
        return response.status_code


if __name__ == "__main__":
    # ItmoId.get_access_token()
    # ItmoId.get_code_auth()
    # print(ItmoId.get_pub_keys())
    # print(ItmoId.leave_sso())
    # print(ItmoId.get_user_info())
    pass
