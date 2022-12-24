from flask import request
from functools import wraps

from server.services.sso.jwt_verify import verify
from server.services.sso.itmo_id import ItmoId
from server.services.sso.env_params import jwt_verify


def check_auth(handle):

    @wraps(handle)
    def handle_work(*args, **kwargs):
        access_token = request.cookies.get("access_token")
        if not access_token:
            access_token = ItmoId.get_access_token()

        print("access_token", access_token, "\nfunk_name:", handle.__name__)
        if jwt_verify:
            stat = verify(access_token)
            if stat["status"] == "ok":
                payload = stat["payload"]
            else:
                return stat["status"], 404

        return handle(*args, **kwargs)

    return handle_work
