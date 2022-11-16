FROM python:3

WORKDIR /usr/src/app
COPY . .

RUN pip3 install poetry

RUN poetry config virtualenvs.create false && poetry install


ENTRYPOINT ["./gunicorn.sh"]
