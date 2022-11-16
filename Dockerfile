FROM python:latest

WORKDIR /usr/src/app
COPY . .

RUN pip3 install --default-timeout=100 poetry

RUN poetry config virtualenvs.create false && poetry install


ENTRYPOINT ["./gunicorn.sh"]
