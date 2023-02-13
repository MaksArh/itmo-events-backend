#!/bin/sh
gunicorn -b 0.0.0.0:8080 -k uvicorn.workers.UvicornWorker wsgi:app
#gunicorn --bind 0.0.0.0:8080 wsgi:app -k Quart-UVLoop
#--worker-class uvicorn.workers.UvicornWorker
#gunicorn --bind 0.0.0.0:8080 wsgi:app -k gevent --workers=1 --worker-connections 1000
#
#gunicorn --bind 127.0.0.1:8080 wsgi:app
#gunicorn  --config gunicorn.py 'run:create_app()'
#gunicorn --bind=127.0.0.1:8000 --workers=1 --worker-class=gevent --worker-connections=1000 wsgi:app
#gunicorn --chdir server '__main__':app -w 2 --worker-class gevent --threads 2 -b 0.0.0.0:8080
