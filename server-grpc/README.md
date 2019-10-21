# Hyena Workload Provider: gRPC Server
gRPC server of Hyena workload provider

## Docker Deployment

If possible, please always use `docker-compose` method.

The docker-compose example config file is already provided at root folder.

The following command is for the manual deployment case.

``` shell
# The manual deployment command 
docker run -d \
  --name hyena-grpc-c1 \
  -v /path/2/configs:/www/hyenaProxy/configs \
  -v /path/2/statics:/www/hyenaGRPC/statics \
  valorad/hyena-grpc

  # inspect id
  docker inspect hyena-gRPC-c1 | grep '"IPAddress"' | head -n 1
```