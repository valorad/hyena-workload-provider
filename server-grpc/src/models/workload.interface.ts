interface IListOptions {
  rfwID?: string,
  category: string,
  fields?: string[],
  unitSize?: number,
  batchID?: number,
  batchSize?: number,
}

interface IWorkload {
  [index: string] : number | undefined,
  CPUUtilization_Average?: number,
  NetworkIn_Average?: number,
  NetworkOut_Average?: number,
  MemoryUtilization_Average?: number,
  Final_Target?: number,
}

interface IWorkloadResponse {
  rfwID: string,
  lastBatchID: number,
  workloadBatches: IWorkload[][]
}

interface IWorkloadService {
  List: (options: IListOptions) => IWorkloadResponse
}

export interface IWorkloadProto {
  ListOptions: IListOptions,
  Workload: IWorkload,
  WorkloadList: IWorkload[],
  WorkloadResponse: IWorkloadResponse,
  WorkloadService: IWorkloadService,
}