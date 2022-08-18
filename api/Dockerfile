FROM python:3.10.5

WORKDIR /api

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1

#RUN pip3 install --upgrade pip --proxy="192.168.0.251:808"

COPY requirements.txt .
#RUN pip3 install --no-cache-dir -r requirements.txt --proxy="192.168.0.251:808"

COPY . .