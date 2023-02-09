from starlette import status

from server.services.sso.auth import check_auth


@check_auth
def index():

    return "Hi", status.HTTP_200_OK
