import { IWorkloadProto } from "./type.interface"; 
import { _WorkloadService as service } from "./service";

export class Workload  {

  list: (req: IWorkloadProto["ListOptions"]) => Promise<IWorkloadProto["WorkloadResponse"]>
  = (options) => {
    return new Promise((resolve, reject) => {
      service.list(
        options,
        (error: Error, response: IWorkloadProto["WorkloadResponse"]) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            resolve(response);
          }
        }
      )
    });

  }

}