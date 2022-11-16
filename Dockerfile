FROM python:latest

WORKDIR /usr/src/app
COPY . .

RUN mkdir ~/.pip && cd ~/.pip/  && echo "[global] \ntrusted-host =  pypi.douban.com \nindex-url = http://pypi.douban.com/simple" >  pip.conf
RUN pip3 install --default-timeout=100 poetry

RUN poetry config virtualenvs.create false && poetry install


ENTRYPOINT ["./gunicorn.sh"]
