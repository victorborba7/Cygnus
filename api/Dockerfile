FROM python:3.10

WORKDIR /api

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1

#RUN pip3.10 install --upgrade pip

COPY requirements.txt .
#RUN pip3.10 install --no-cache-dir -r requirements.txt --proxy="192.168.0.251:808"

COPY . .