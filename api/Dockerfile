FROM python:3.10

WORKDIR /api

RUN yum -y install epel-release && yum clean all
RUN yum -y install python-pip-3.10 && yum clean all

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1

RUN pip3.10 install --upgrade pip

COPY requirements.txt .
RUN pip3.10 install --no-cache-dir -r requirements.txt

COPY . .