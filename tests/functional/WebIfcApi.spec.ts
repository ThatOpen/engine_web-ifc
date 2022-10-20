import * as fs from 'fs';
import * as path from 'path';
import * as WebIFC from '../../dist/web-ifc-api-node.js';
import type { Vector, FlatMesh, IfcAPI } from '../../dist/web-ifc-api-node.js';


let modelId : number
let ifcApi : IfcAPI


beforeAll(async () => {
    ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();

    const exampleIFCPath = path.join(__dirname, '../artifacts/example.ifc.test');
    const exampleIFCData = fs.readFileSync(exampleIFCPath);
    modelId = ifcApi.OpenModel(exampleIFCData);
})


describe('WebIfcApi', () => {
    test('can retrieve a modelId', () => {
        expect(modelId).toBe(0);
    })

    test('can ensure model is open', () => {
        const isOpen : boolean = ifcApi.IsModelOpen(modelId);
        expect(isOpen).toBeTruthy();
    })

    test('can return the correct number of elements', () => {
        const geometry : Vector<FlatMesh> = ifcApi.LoadAllGeometry(modelId);
        expect(geometry.size()).toBe(119);
    })

    test('can write a new property value and read it back in', async () => {
      async function getFirstStorey(api, mId) {
        const storeyIds = await api.properties.getAllItemsOfType(mId, WebIFC.IFCBUILDINGSTOREY, false);
        expect(storeyIds.length).toBe(2);
        const storeyId = storeyIds[0];
        const storey = await api.properties.getItemProperties(mId, storeyId);
        return [storey, storeyId];
      }
      let [storey, storeyId] = await getFirstStorey(ifcApi, modelId);
      const newStoreyName = 'Nivel 1 - Editado'
      storey.LongName.value = newStoreyName;
      ifcApi.WriteLine(modelId, storey);
      storey = await ifcApi.properties.getItemProperties(modelId, storeyId);
      expect(storey.LongName.value).toBe(newStoreyName);

      const writtenData = await ifcApi.ExportFileAsIFC(modelId);
      modelId = ifcApi.OpenModel(writtenData);
      [storey, storeyId] = await getFirstStorey(ifcApi, modelId);
      expect(storey.LongName.value).toBe(newStoreyName);
    })
})


afterAll(() => {
    ifcApi.CloseModel(modelId);
    const isOpen : boolean = ifcApi.IsModelOpen(modelId);
    expect(isOpen).toBeFalsy()
})
