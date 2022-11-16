FROM python:latest

WORKDIR /usr/src/app
COPY . .
RUN curl -sSL https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py | python
#RUN pip3 install -r requirements.txt
RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi

RUN chmod +x ./gunicorn.sh

