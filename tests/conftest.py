import pytest

import os
from dotenv import load_dotenv
from os import environ
from sqlalchemy_utils import create_database, database_exists, drop_database

from configurations.default import DefaultSettings

# from data_base.base import engine, session

cookies = {'access_token': 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwSVliSmNVLW1wbEdBdzhFMzNSNkNKTUdWa3hZdUQ2eUItdWt3RlBJOXV3In0.eyJleHAiOjE2NzYwNTk2MjAsImlhdCI6MTY3NjA1NzgyMCwiYXV0aF90aW1lIjoxNjc1OTQ3NjUxLCJqdGkiOiI3ODRjYWMyMC02MDE0LTRjM2ItOWE3Yi0xOWZhOWY1NTNhYzYiLCJpc3MiOiJodHRwczovL2lkLml0bW8ucnUvYXV0aC9yZWFsbXMvaXRtbyIsInN1YiI6IjI1ODgzOTE0LWI2MGEtNGY4Zi1hYjUxLTNiOTY4MzYzOTVkNyIsInR5cCI6IkJlYXJlciIsImF6cCI6InN0dWRlbnRzLXByb2plY3QtZXZlbnQtZGV2Iiwic2Vzc2lvbl9zdGF0ZSI6IjQ1NDM5ZGIwLTJkZjQtNDNkMC05NzhiLWIzZTY0N2VmOTVmOSIsImFjciI6IjAiLCJzY29wZSI6Im9wZW5pZCIsInNpZCI6IjQ1NDM5ZGIwLTJkZjQtNDNkMC05NzhiLWIzZTY0N2VmOTVmOSIsImlzdSI6Mjg0Njc5fQ.BhtfLmq3p6S9jvOstJ-rvkWuH87DW3vG3g2GOOsreOil5xUuK45abPh-fJsx8jBNa3tsIzGGRSvjqLt_a4OfpN0Lz3GNRFX_hTKL8bK18_GuURiFj4eh_rqYGxIcdUtWrBKVfeB_FGe4-8e1bNXQoTA2Ki8IJfJfDxGirXzBTmUxWHS3UPqx503II3xa_WuLhWUr5PvBLL8Oy6OynT6cb3wDei2lBcxRHDaeH2NaUwo00K0n3m47BsloNxNoFmR0G8DZ7GzjGr0f9-jUNg0PWc87mPXU7d7tf9df6pr8pXk0D7jWGrgo9En5Q1aQJoNgmuaSPq6XZU3Bwd3U_sI5qA'}


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
