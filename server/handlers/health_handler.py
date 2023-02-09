
from starlette import status
from sqlalchemy_utils import database_exists

from configurations.default import DefaultSettings


class HealthHandler:
    @staticmethod
    def health_db():
        settings = DefaultSettings()
        db_uri = settings.database_uri
        if database_exists(db_uri):
            return "db connected", status.HTTP_200_OK
        return "db doesn't connected", status.HTTP_404_NOT_FOUND

    @staticmethod
    def health_app():

        return "app live", status.HTTP_200_OK
