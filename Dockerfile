FROM python:3.12.0a2-slim-buster

WORKDIR /usr/src/app
COPY . .

#RUN apt update
#RUN apt -y install build-essential libssl-dev libffi-dev python3-dev
RUN mkdir ~/.pip && cd ~/.pip/  && echo "[global] \ntrusted-host =  pypi.douban.com \nindex-url = http://pypi.douban.com/simple" >  pip.conf

RUN pip3 install poetry

RUN poetry source add --default doubanio https://pypi.doubanio.com/simple

RUN poetry config virtualenvs.create false && poetry install


ENTRYPOINT ["./gunicorn.sh"]
