FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
CMD wget --spider -q http://localhost || exit 1
LABEL maintainer="OscarLP09"
LABEL version="1.0"