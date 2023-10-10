FROM python:3.11

RUN apt update && apt upgrade --yes && apt install --yes ffmpeg

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/Bleualign

RUN python setup.py install

WORKDIR /usr/src/app/synctalk

RUN pip install --no-cache-dir --requirement requirements.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
