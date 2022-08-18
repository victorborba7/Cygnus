FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY / /home/html

COPY nginx.conf /etc/nginx