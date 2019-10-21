# Hyena Workload Provider: Proxy server
Proxy server of Hyena workload provider

## API doc

Checkout the latest Api document on [Apiary](https://hyenaproxy.apiary.io).

## Docker Deployment

If possible, please always use `docker-compose` method.

The docker-compose example config file is already provided at root folder.

The following command is for the manual deployment case.

``` shell
# The manual deployment command 
docker run -d \
  --name hyena-proxy-c1 \
  -v /path/2/configs:/www/hyenaProxy/configs \
  valorad/hyena-proxy

  # inspect id
  docker inspect hyena-proxy-c1 | grep '"IPAddress"' | head -n 1
```