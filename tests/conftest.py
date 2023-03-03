import pytest

import os
from dotenv import load_dotenv
from os import environ
from sqlalchemy_utils import create_database, database_exists, drop_database

from configurations.default import DefaultSettings

# from data_base.base import engine, session

cookies = {'access_token': 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwSVliSmNVLW1wbEdBdzhFMzNSNkNKTUdWa3hZdUQ2eUItdWt3RlBJOXV3In0.eyJleHAiOjE2Nzc4NjgzMTcsImlhdCI6MTY3Nzg2NjUxNywiYXV0aF90aW1lIjoxNjc3Nzg1NjMyLCJqdGkiOiI0NjgwMTgwNi0wOWY1LTQ4YTYtYTRlYi1kMjE0MGEyY2ZiNGUiLCJpc3MiOiJodHRwczovL2lkLml0bW8ucnUvYXV0aC9yZWFsbXMvaXRtbyIsInN1YiI6IjI1ODgzOTE0LWI2MGEtNGY4Zi1hYjUxLTNiOTY4MzYzOTVkNyIsInR5cCI6IkJlYXJlciIsImF6cCI6InN0dWRlbnRzLXByb2plY3QtZXZlbnQtZGV2Iiwic2Vzc2lvbl9zdGF0ZSI6IjBlNzJjMDlmLWUwMjgtNDZlOS05YjRjLTQzZDk5ZjNkMmE5OSIsImFjciI6IjAiLCJzY29wZSI6Im9wZW5pZCIsInNpZCI6IjBlNzJjMDlmLWUwMjgtNDZlOS05YjRjLTQzZDk5ZjNkMmE5OSIsImlzdSI6Mjg0Njc5fQ.oc50Vai505Xv49nGiz4F6RHkPb_tb4ycuQ24eyBZZspfm72yqEwpT5ixWswPuGajnp7v0FycFEfsVx-VDiVM0K5kQ8CEhyt0LECDwquJy9SHLo7SlzIezjr_hIbvXTYU8bUOKxFy0C5u9bCqXWuwq4-amZGQcgyN5TaJph6nOA-RlnlkG1_vOH2nRShT64WzYQIV1c_Si8xjdsVRD_imqzCTPmgrvNYFzSlBgmEbgm03OLGA1YBIuuDv3lWaowxigTGxOHVn3ClskB4AmGrNC_6l5kuopb3DuvmvaWg3e02jcFPIMkc64rFLxTdyYhb7axU7OtXCLHC-GQLfKfviHg'}
# cookies = {'access_token': ''}


dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)


@pytest.fixture
def get_base_url():
    app_host = environ.get("APP_HOST", "localhost")
    app_port = environ.get("APP_PORT", 8080)

    address = f"http://{app_host}:{app_port}"

    return address


@pytest.fixture
def get_db_uri():
    user = environ.get("POSTGRES_USER", "postgres")
    password = environ.get("POSTGRES_PASSWORD", "postgres")
    host = environ.get("POSTGRES_HOST", "127.0.0.1")
    port = environ.get("POSTGRES_PORT", "5432")
    database = environ.get("POSTGRES_DB", "ITMO_Event")

    db_uri = f"postgresql://{user}:{password}@{host}:{port}/{database}"

    return db_uri

#
# @pytest.fixture()
# def postgres() -> str:
#     """
#     Создает временную БД для запуска теста.
#     """
#     settings = DefaultSettings()
#
#     tmp_name = ".".join(["temp", "pytest"])
#     settings.POSTGRES_DB = tmp_name
#     environ["POSTGRES_DB"] = tmp_name
#
#     tmp_url = settings.database_uri_sync
#     if not database_exists(tmp_url):
#         create_database(tmp_url)
#
#     try:
#         yield settings.database_uri
#     finally:
#         drop_database(tmp_url)
