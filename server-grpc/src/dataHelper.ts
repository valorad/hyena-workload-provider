import { readFile } from "fs";
import { promisify } from "util";
import * as parse from "csv-parse";
import { resolve } from "path";
import { IWorkloadProto } from "./models/workload.interface";

const readFileAsync = promisify(readFile);

export class DataHelper {

  private _options = {
    hasHeader: true
  };

  headers: string[] = [];

  data: IWorkloadProto["WorkloadList"] = [];
  /**
   *
   */
  constructor(options?: any) {
    if (options) {
      this._options = options;
    }
  }

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
          this.headers.push(`column${i}`);
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

  extractData = () => {};

  splitData = () => {};

  help = async (category: string) => {
    let content = await this.loadData(`${category}.csv`);
    let rawData = await this.parseCSV(content);
    this.formData(rawData);
    return this.data;
  };

}