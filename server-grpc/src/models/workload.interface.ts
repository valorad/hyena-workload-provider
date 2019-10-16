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

interface IWorkloadService {
  List: (options: IListOptions) => IWorkload[]
}

export interface IWorkloadProto {
  ListOptions: IListOptions,
  Workload: IWorkload,
  WorkloadList: IWorkload[],
  WorkloadService: IWorkloadService,
}