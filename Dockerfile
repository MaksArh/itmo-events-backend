FROM python:latest

WORKDIR /usr/src/app
COPY . .

RUN mkdir ~/.pip && cd ~/.pip/  && echo "[global] \ntrusted-host =  pypi.douban.com \nindex-url = http://pypi.douban.com/simple" >  pip.conf
RUN pip3 install poetry

RUN poetry source add --default douban http://pypi.douban.com/simple

RUN poetry config virtualenvs.create false && poetry install


ENTRYPOINT ["./gunicorn.sh"]
