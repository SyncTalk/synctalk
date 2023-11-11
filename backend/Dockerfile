FROM python:3.10

RUN apt update && apt upgrade --yes && apt install --yes ffmpeg

WORKDIR /usr/src/app

COPY Bleualign Bleualign

WORKDIR /usr/src/app/Bleualign

RUN python setup.py install

WORKDIR /usr/src/app

COPY synctalk/requirements.txt synctalk/requirements.txt
COPY synctalk/nltk_install.py synctalk/nltk_install.py

WORKDIR /usr/src/app/synctalk

RUN pip install --no-cache-dir --requirement requirements.txt
RUN python3 nltk_install.py

WORKDIR /usr/src/app

COPY synctalk synctalk

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
