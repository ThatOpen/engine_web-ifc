const fs = require('fs');
const path = require('path');
const WebIFC = require('../../dist/web-ifc-api-node.js');

let modelID
let ifcApi
beforeAll(async () => {
  ifcApi = new WebIFC.IfcAPI();
  await ifcApi.Init();

  const exampleIFCPath = path.join(__dirname, '../artifacts/example.ifc');
  const exampleIFCData = fs.readFileSync(exampleIFCPath);
  modelID = ifcApi.OpenModel(exampleIFCData);
})

describe('WebIfcApi', () => {
  test('Load a basic IFC model', async () => {
    const geometry = ifcApi.LoadAllGeometry(modelID);
  
    expect(modelID).toBe(0);
    expect(geometry.size()).toBe(119);
  })
})

afterAll(() => {
  ifcApi.CloseModel(modelID);
})
