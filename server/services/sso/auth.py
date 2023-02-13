from quart import request
from functools import wraps
from starlette import status

from server.services.sso.jwt_verify import verify
from server.services.sso.env_params import jwt_verify
from server.services.sso.itmo_id import ItmoId


def check_auth(handle):
    @wraps(handle)
    async def handle_work(*args, **kwargs):
        if jwt_verify:
            access_token = request.cookies.get("access_token")
            if not access_token:
                return await ItmoId.get_code_auth(), status.HTTP_302_FOUND
            stat = await verify(access_token)
            if stat["status"] == "ok":
                # payload = stat["payload"]
                # print(payload)
                pass
            else:
                return stat["status"], status.HTTP_401_UNAUTHORIZED

        return await handle(*args, **kwargs)

    return handle_work
