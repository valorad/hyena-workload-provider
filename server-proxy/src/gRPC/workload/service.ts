import { resolve } from "path";

import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

import { client } from "../client";



class WorkloadService {
  
  typeDefs = loadSync(resolve(__dirname, "models/src/gRPC/workload/type.proto")); // hack: because grpc-js does not support content load
  type: any = loadPackageDefinition(this.typeDefs).workload;

  service = this.type.WorkloadService;

  createService = () => {
    return new this.service(client.host, credentials.createInsecure())
  };

}

export const _WorkloadService = new WorkloadService().createService();