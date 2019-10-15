import { DataHelper } from "../dataHelper";



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

});