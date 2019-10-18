// import * as grpc from "@grpc/grpc-js";
import { resolve } from "path";

import { Server, ServerCredentials, loadPackageDefinition } from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as uuid from "uuid/v4";

import { IWorkloadProto } from "./models/workload.interface";
import { DataHelper } from "./dataHelper";
import { ConfigLoader } from "./utils/configLoader";

const workloadDef = protoLoader.loadSync(resolve(__dirname, "models/workload.proto"));
// <-- no way found to let protoLoader read file content directly,  
//     so I can only ask Webpack to copy files to models folder instead.

const workloadProto: any = loadPackageDefinition(workloadDef).workload;
// <-- by of type any I mean GrpcObject<IWorkloadProto> which is unfortunately not supported
//    This is a hack because GrpcObject does not support Gereric Types
//    and I don't know how otherwise to let TypeScript understand.

const gServer = new Server();

const resolvers = {
  list: async (ctx: any, callback: any) => {

    let listOptions: IWorkloadProto["ListOptions"] = ctx.request;

    let dhOptions = {} as any;
    if (listOptions.fields) {dhOptions.fields = listOptions.fields }
    if (listOptions.unitSize) {dhOptions.unitSize = listOptions.unitSize }
    
    const dataHelper = new DataHelper(dhOptions);
    await dataHelper.help(listOptions.category);
    
    let startBatchID = listOptions.batchID || 0;
    let batchSize = listOptions.batchSize || dataHelper.data.length;
    let batches = dataHelper.selectBatch(startBatchID, batchSize);

    // create gRPC recognizable response
    let workloadBatches = [];
    for (let listChunk of batches) {
      workloadBatches.push({
        workloads: listChunk
      })
    }

    let response: IWorkloadProto["WorkloadResponse"] = {
      rfwID: listOptions.rfwID || uuid(), // generate a rfw id if not provided
      lastBatchID: startBatchID + batchSize - 1,
      workloadBatches: workloadBatches
    }
   
    callback(null, response); // <-- you ALWAYS have to return an object
  }
}

gServer.addService(workloadProto.WorkloadService.service, resolvers);

const config = new ConfigLoader("hyenaGRPC.json").config().gRPC;

gServer.bindAsync(config.host, ServerCredentials.createInsecure(), () => {
  console.log(`gRPC Server is running at ${config.host}`);

  gServer.start()
});