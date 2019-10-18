import { ConfigLoader } from "../utils/configLoader"

const gRPCConfig = new ConfigLoader("hyenaProxy.json").config().gRPC;

export const client = {
  host: gRPCConfig.host
}