FROM nginx:alpine

RUN rm /etc/nginx/conf.d
RUN rm /etc/nginx/default.conf

COPY / /home/html

COPY nginx.conf /etc/nginx