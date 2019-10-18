/**
 * The data type that the proxy server will return to the front-end
 */

interface IWorkload {
  CPUUtilization_Average?: number,
  NetworkIn_Average?: number,
  NetworkOut_Average?: number,
  MemoryUtilization_Average?: number,
  Final_Target?: number,
}

interface IWorkloadBatch {
  workloads: IWorkload
}

export interface IWorkloadResponse {
  rfwID: string,
  lastBatchID: number,
  workloadBatches: IWorkloadBatch[]
}
