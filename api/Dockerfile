FROM python:3.10

ENV http_proxy http://proxy-chain.xxx.com:911/
ENV https_proxy http://proxy-chain.xxx.com:912/

WORKDIR /api

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1

RUN pip3.10 install --upgrade pip

COPY requirements.txt .
RUN pip3.10 install --no-cache-dir -r requirements.txt

COPY . .