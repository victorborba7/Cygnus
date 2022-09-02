FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY / /home/html

COPY /images/logo.svg /home/html/images

COPY nginx.conf /etc/nginx