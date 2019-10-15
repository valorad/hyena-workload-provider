// import * as grpc from "@grpc/grpc-js";
import { resolve } from "path";

import { Server, ServerCredentials, loadPackageDefinition } from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

import { IWorkloadProto } from "./models/workload.interface";

const workloadDef = protoLoader.loadSync(resolve(__dirname, "models/workload.proto"));
// <-- no way found to let protoLoader read file content directly,  
//     so I can only ask Webpack to copy files to models folder instead.

const workloadProto: any = loadPackageDefinition(workloadDef).workload;
// <-- by of type any I mean GrpcObject<IWorkloadProto> which is unfortunately not supported
//    This is a hack because GrpcObject does not support Gereric Types
//    and I don't know how otherwise to let TypeScript understand.

const gServer = new Server();

const resolvers = {
  list: (ctx: any, callback: any) => {

    let data: IWorkloadProto["Workload"][] = [];
    let listOptions: IWorkloadProto["ListOptions"] = ctx.request;

    console.log(ctx.request);

    // TODO: Helper query data back
    
    callback(null, {data}); // <-- you ALWAYS have to return an object
  }
}

gServer.addService(workloadProto.WorkloadService.service, resolvers);

const host = "localhost:50051";

gServer.bindAsync(host, ServerCredentials.createInsecure(), () => {
  console.log(`gRPC Server is running at ${host}`);

  gServer.start()
});