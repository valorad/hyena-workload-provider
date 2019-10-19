# Hyena Workload Provider
Assignment 1 for course Programming on Cloud

## Proxy Server API doc
Checkout the latest Api document of the proxy server on [Apiary](https://app.apiary.io/hyenaproxy).

## Docker Deployment
- Create your own version of `docker-compose.yml` following the example compose config.
- Within `docker-compose.yml` file
  - Specify all the `volumes` paths according to your own situation
  - Change the `ipv4_address` field if necessary.
- Create the two configs files following the examples accordingly. Make sure the host name and port information is correct.
  - `...grpc/configs/hyenaGRPC.json`
  - `...proxy/configs/hyenaProxy.json`

- Run command

  ``` shell
  $ docker-compose up -d
  ```