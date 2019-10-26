import { readFile } from "fs";
import { promisify } from "util";
import * as parse from "csv-parse";
import { resolve } from "path";
import { IWorkloadProto } from "./models/workload.interface";

const readFileAsync = promisify(readFile);

interface DataHelperOptions {
  hasHeader?: boolean,
  fields?: string[],
  unitSize?: number,
}


export class DataHelper {

  private _options = {
    hasHeader: true,
    fields: [],
    unitSize: 100
  };

  headers: string[] = [];

  private _data: IWorkloadProto["WorkloadList"] = [];

  get data() {
    return this._data;
  }

  set data(newData) {
    this._data = newData;
  }

  dataBatched: IWorkloadProto["WorkloadList"][] = [];

  toJSON = (rowData: number[]) => {
    let json = {} as IWorkloadProto["Workload"];

    for (let i = 0; i < this.headers.length; i++) {
      json[ this.headers[i] ] = rowData[i];
    }

    return json;
  };

  formData = (content: string[][]) => {

    // extract header
    if (content.length > 0) {
      const line1 = content[0];
      for (let i = 0; i < line1.length; i++) {
        if (this._options.hasHeader) {
          this.headers.push(line1[i]);
        } else {
          this.headers.push(`column${ i + 1 }`);
        }
      }

      if (!this._options.hasHeader) {
        // need to also push 1st line data if no header
        
        // parse str to float
        let rowData = line1.map(strData => parseFloat(strData));
        this.data.push(this.toJSON(rowData));
      }

      // handling 2nd+ lines
      for (let i = 1; i < content.length; i++) {
        // parse str to float
        let rowData = content[i].map(strData => parseFloat(strData));
        this.data.push(this.toJSON(rowData));
      }

    }

  }

  parseCSV: (content: string)=>Promise<string[][]>
   = (content: string) => {
    return new Promise((resolve, reject) => {
      parse(
        content,
        {
          delimiter: ',',
          comment: "#",
          trim: true,
          skip_lines_with_error: true
        },
        (error, output) => {
          if (error) {
            console.error(error)
            reject([]);
          } else {
            resolve(output);
          }
        }
      );
    });
  };

  loadData = async (fileName: string) => {
    let file = "";
    try {
      file = await readFileAsync(resolve(__dirname, `statics/${fileName}`), { encoding: "utf-8" });
    } catch (error) {
      console.error(`Error: Failed to load file ${fileName}: \n ${error}`);
    }
    return file;
  };

  extractData = () => {
    this.data = this.data.map((workload) => {
      let extractedData = { } as IWorkloadProto["Workload"];
      for (let field of this._options.fields) {
        extractedData[field] = workload[field];
      }
      return extractedData;
    });
  };

  splitData = () => {
    let i = 0;
    while (i < this.data.length) {
      this.dataBatched.push(this.data.slice(i, i += this._options.unitSize));
    }
  };

  help = async (category: string) => {
    let content = await this.loadData(`${category}.csv`);
    let rawData = await this.parseCSV(content);
    this.formData(rawData);
    if (this._options.fields.length > 0) {
      this.extractData();
    }
    this.splitData();
  };

  selectBatch = (startPos: number, batchSize: number) => {
    return this.dataBatched.slice(startPos, batchSize + startPos);
  };

  /**
   *
   */
  constructor(options?: DataHelperOptions) {
    if (options) {
      this._options = {
        ...this._options,
        ...options
      } as any;
    }
  }



}