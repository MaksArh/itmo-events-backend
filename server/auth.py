import requests

# GET https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/auth


def get_code_auth():
    client_id = 0
    response_type = "code"
    redirect_uri = 0
    scope = 0

    address = "https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/auth"
    method = "GET"


