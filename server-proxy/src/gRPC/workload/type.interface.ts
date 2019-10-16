interface IListOptions {
  rfwID?: string,
  category: string,
  fields?: string[],
  unitSize?: number,
  batchID?: number,
  batchSize?: number,
}

interface IWorkload {
  [index: string] : Long | number | undefined,
  CPUUtilization_Average?: number,
  NetworkIn_Average?: Long,
  NetworkOut_Average?: Long,
  MemoryUtilization_Average?: number,
  Final_Target?: number,
}

interface IWorkloadList {
  workloads: IWorkload[],
}

interface IWorkloadResponse {
  rfwID: string,
  lastBatchID: number,
  workloadBatches: IWorkloadList[]
}

interface IWorkloadService {
  list: (options: IListOptions) => IWorkloadResponse
}

export interface IWorkloadProto {
  ListOptions: IListOptions,
  Workload: IWorkload,
  WorkloadList: IWorkload[],
  WorkloadResponse: IWorkloadResponse,
  WorkloadService: IWorkloadService,
}