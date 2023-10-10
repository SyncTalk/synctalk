FROM python:3.10

RUN apt update && apt upgrade --yes && apt install --yes ffmpeg

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip install --no-cache-dir --requirement requirements.txt

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
