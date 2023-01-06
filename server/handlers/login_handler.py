from flask import request, make_response, redirect, url_for
from starlette import status
import datetime

from server.services.sso.itmo_id import ItmoId


def set_tokens(access_token: str, expires_in: str, refresh_token: str, refresh_expires_in: str):
    expires_in = datetime.datetime.utcnow() + datetime.timedelta(seconds=int(expires_in))
    refresh_expires_in = datetime.datetime.utcnow() + datetime.timedelta(seconds=int(refresh_expires_in))

    response = make_response("Here, take some cookie!")
    response.set_cookie(key="access_token", value=access_token, expires=expires_in, httponly=True)
    response.set_cookie(key="refresh_token", value=refresh_token, expires=refresh_expires_in, httponly=True)
    response.status_code = status.HTTP_200_OK
    return response


def login():           # это должен быть redirect_uri !!!!!!!!!!!!!
    print("login ...")
    code = request.args.get('code')
    print("code", code)
    if not code:
        return make_response({"error": "Code not found"}), status.HTTP_401_UNAUTHORIZED

    tokens = ItmoId.get_access_token(code=code)
    if not tokens:
        return make_response({"error": "Tokens error"}), status.HTTP_401_UNAUTHORIZED

    access_token = tokens["access_token"]
    refresh_token = tokens["refresh_token"]
    expires_in = tokens["expires_in"]
    refresh_expires_in = tokens["refresh_expires_in"]

    set_tokens(access_token=access_token,
               expires_in=expires_in,
               refresh_token=refresh_token,
               refresh_expires_in=refresh_expires_in)

    return redirect(location=url_for("index"), code=302)
