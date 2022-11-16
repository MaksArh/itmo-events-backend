FROM python:latest

WORKDIR /usr/src/app
COPY . .
RUN pip install poetry
#RUN pip3 install -r requirements.txt
RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi

RUN chmod +x ./gunicorn.sh

