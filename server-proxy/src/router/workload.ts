import * as Router from 'koa-router';
import { WorkloadAction as Action } from '../actions/workload.action';
import { Workload } from '../gRPC/workload';

interface proxyQuery {
  [index: string]: string | string[] | number,
  rfwID: string,
  fields: string[],
  unitSize: number,
  batchID: number,
  batchSize: number
}

class WorkloadRoute {
  router = new Router();
  action = new Action();

  /**
   *
   */
  constructor() {
    
    this.router.get('/', async (ctx) => {

      ctx.body = {
        message: "Workloads works!"
      };

    });

    this.router.get('/category/:category', async (ctx) => {

      const validFields = [
        "rfwID",
        "fields",
        "unitSize",
        "batchID",
        "batchSize",
      ];

      let queryReq: any = ctx.query || {};
      let query = {} as proxyQuery;
      for (let field of validFields) {
        if (queryReq[field]) {
          query[field] = queryReq[field];
        }
      }

      // format fields
      if (queryReq.fields) {
        query.fields = queryReq.fields.split(",");
      }

      const resolver = new Workload();

      let qResult = await resolver.list({
        category: ctx.params.category,
        ...query
      });

      ctx.body = qResult || {message: `Failed to perform query.` };

      // ctx.body = {};
      

    });
    
  }



}

const _workload = new WorkloadRoute();

export const workload = _workload.router;