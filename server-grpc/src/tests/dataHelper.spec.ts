import { DataHelper } from "../dataHelper";
import Long = require("long");



export const dataHelperspec = describe("Data Helper spec", () => {

  test("Convert CSV content to a json array: with header", async () => {
    const mockCSVContent = `CPUUtilization_Average,NetworkIn_Average,NetworkOut_Average,MemoryUtilization_Average,Final_Target\n47,237680598,239043377,52.91314954,47.77583879\n46,259965162,258764450,52.78844261,47.15173944\n42,233246999,218742552,46.68909772,42.35888502\n33,194803090,185055560,41.72902283,35.66691474\n31,171400566,163390599,40.33998435,34.3093731\n37,183125327,174387148,40.53621278,36.91196676\n43,214127954,204003876,43.29135651,41.19404886\n`;
    const dataHelper = new DataHelper({hasHeader: true});
    let rawData = await dataHelper.parseCSV(mockCSVContent);
    expect(rawData[0]).toBeTruthy();
    dataHelper.formData(rawData);
    
    expect(dataHelper.data[0].CPUUtilization_Average).toEqual(47);
    expect(dataHelper.data[dataHelper.data.length - 1].Final_Target).toEqual(41.19404886);
  });

  test("Convert CSV content to a json array: no header", async () => {
    const mockCSVContent = `47,237680598,239043377,52.91314954,47.77583879\n46,259965162,258764450,52.78844261,47.15173944\n42,233246999,218742552,46.68909772,42.35888502\n33,194803090,185055560,41.72902283,35.66691474\n31,171400566,163390599,40.33998435,34.3093731\n37,183125327,174387148,40.53621278,36.91196676\n43,214127954,204003876,43.29135651,41.19404886\n`;
    const dataHelper = new DataHelper({hasHeader: false});
    let rawData = await dataHelper.parseCSV(mockCSVContent);
    expect(rawData[0]).toBeTruthy();
    dataHelper.formData(rawData);
    expect(dataHelper.data[0].column1).toEqual(47);
    expect(dataHelper.data[dataHelper.data.length - 1].column5).toEqual(41.19404886);
  });

  test("Extract Data: given field", async () => {

    const mockData = [
      {
        CPUUtilization_Average: 47,
        NetworkIn_Average: new Long(237680598),
        NetworkOut_Average: new Long(239043377),
        MemoryUtilization_Average: 52.91314954,
        Final_Target: 47.77583879
      },
      {
        CPUUtilization_Average: 46,
        NetworkIn_Average: new Long(259965162),
        NetworkOut_Average: new Long(258764450),
        MemoryUtilization_Average: 52.78844261,
        Final_Target: 47.15173944
      },
      {
        CPUUtilization_Average: 42,
        NetworkIn_Average: new Long(233246999),
        NetworkOut_Average: new Long(218742552),
        MemoryUtilization_Average: 46.68909772,
        Final_Target: 42.35888502
      },
      {
        CPUUtilization_Average: 33,
        NetworkIn_Average: new Long(194803090),
        NetworkOut_Average: new Long(185055560),
        MemoryUtilization_Average: 41.72902283,
        Final_Target: 35.66691474
      }
    ];

    const dataHelper = new DataHelper({fields: ["CPUUtilization_Average", "Final_Target"]});
    dataHelper.data = mockData;
    dataHelper.extractData();
    expect(dataHelper.data[0]).toBeTruthy();
    expect(dataHelper.data[1].CPUUtilization_Average).toEqual(46);
    expect(dataHelper.data[2].Final_Target).toEqual(42.35888502);
    expect(dataHelper.data[3].NetworkIn_Average).toBeUndefined();

  });

  test("Extract Data: no field", async () => {

    // extracted data should contain all fields

    const mockData = [
      {
        CPUUtilization_Average: 33,
        NetworkIn_Average: new Long(194803090),
        NetworkOut_Average: new Long(185055560),
        MemoryUtilization_Average: 41.72902283,
        Final_Target: 35.66691474
      },
      {
        CPUUtilization_Average: 31,
        NetworkIn_Average: new Long(171400566),
        NetworkOut_Average: new Long(163390599),
        MemoryUtilization_Average: 40.33998435,
        Final_Target: 34.3093731
      },
      {
        CPUUtilization_Average: 37,
        NetworkIn_Average: new Long(183125327),
        NetworkOut_Average: new Long(174387148),
        MemoryUtilization_Average: 40.53621278,
        Final_Target: 36.91196676
      }
    ];

    let knownFields = [
      "CPUUtilization_Average",
      "NetworkIn_Average",
      "NetworkOut_Average",
      "MemoryUtilization_Average", 
      "Final_Target",
    ];

    const dataHelper = new DataHelper();
    dataHelper.data = mockData;
    dataHelper.extractData();
    for (let field of knownFields) {
      expect(dataHelper.data[0].hasOwnProperty(field));
    }

  });

  test("Batching data and select", async () => {

    const mockData = [
      {
        CPUUtilization_Average: 33,
        NetworkIn_Average: new Long(194803090),
        NetworkOut_Average: new Long(185055560),
        MemoryUtilization_Average: 41.72902283,
        Final_Target: 35.66691474
      },
      {
        CPUUtilization_Average: 33,
        NetworkIn_Average: new Long(194803090),
        NetworkOut_Average: new Long(185055560),
        MemoryUtilization_Average: 41.72902283,
        Final_Target: 35.66691474
      },
      {
        CPUUtilization_Average: 40,
        NetworkIn_Average: new Long(209125328),
        NetworkOut_Average: new Long(204387147),
        MemoryUtilization_Average: 41.53621278,
        Final_Target: 40.91196676
      },
      {
        CPUUtilization_Average: 46,
        NetworkIn_Average: new Long(259965162),
        NetworkOut_Average: new Long(258764450),
        MemoryUtilization_Average: 52.78844261,
        Final_Target: 47.15173944
      },
      {
        CPUUtilization_Average: 37,
        NetworkIn_Average: new Long(183125327),
        NetworkOut_Average: new Long(174387148),
        MemoryUtilization_Average: 40.53621278,
        Final_Target: 36.91196676
      }
    ];

    const dataHelper = new DataHelper({unitSize: 2});
    dataHelper.data = mockData;
    dataHelper.splitData();
    expect(dataHelper.dataBatched.length).toEqual(3);
    expect(dataHelper.dataBatched[0].length).toEqual(2);

    // selecting the 2nd batch, want 2 batches
    let batches = dataHelper.selectBatch(1, 2);
    // The last batch should contain just 1 workload
    expect(batches.length).toEqual(1);

    // selecting the 5th batch, want 999 batches
    batches = dataHelper.selectBatch(4, 999);
    // Should return nothing (an empty array)
    expect(batches[0]).toBeUndefined();

  });



});