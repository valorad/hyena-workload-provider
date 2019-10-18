import { Workload } from '../gRPC/workload';
import { IWorkloadProto } from '../gRPC/workload/type.interface';
import { IWorkloadResponse } from '../interfaces/workload.interface';

export class WorkloadAction {
  getBatches = async (listOptions: IWorkloadProto["ListOptions"]) => {

    const resolver = new Workload();

    let grpcResponse = await resolver.list(listOptions);
    let workloadBatches = grpcResponse.workloadBatches;

    for (let batch of workloadBatches) {
      for (let workload of batch.workloads as any[]) {
        if (workload.NetworkIn_Average) { workload.NetworkIn_Average = workload.NetworkIn_Average.low }
        if (workload.NetworkOut_Average) { workload.NetworkOut_Average = workload.NetworkOut_Average.low }
      }
    }

    return grpcResponse as IWorkloadResponse;

  };
}