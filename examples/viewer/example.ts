export let exampleCode = `
    interface pt {
        x: number, y: number, z: number;
    }

    const gridSize = 6;

    let dir: pt =  { x: 0, y: 0, z: 1 };
    let rad: number = 0.25;
    let len: number = 2;
    let direction = ifcAPI.CreateIfcEntity(model,IFCDIRECTION, [ifcAPI.CreateIfcType(model,IFCREAL,dir.x), ifcAPI.CreateIfcType(model,IFCREAL,dir.y), ifcAPI.CreateIfcType(model,IFCREAL,dir.z)]);
    let profileLocation = ifcAPI.CreateIfcEntity(model,IFCCARTESIANPOINT, [ifcAPI.CreateIfcType(model,IFCLENGTHMEASURE,0), ifcAPI.CreateIfcType(model,IFCLENGTHMEASURE,0)]);
    let profileAxis = ifcAPI.CreateIfcEntity(model,IFCAXIS2PLACEMENT2D, profileLocation, null);
    let profile =  ifcAPI.CreateIfcEntity(model, IFCCIRCLEPROFILEDEF, IFC4.IfcProfileTypeEnum.AREA, ifcAPI.CreateIfcType(model,IFCLABEL,'column-prefab'), profileAxis, ifcAPI.CreateIfcType(model,IFCPOSITIVELENGTHMEASURE,rad));   

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
        
            let pos:pt = {x: i, y: j, z: 0};
       

            let location = ifcAPI.CreateIfcEntity(model,IFCCARTESIANPOINT, [ifcAPI.CreateIfcType(model,IFCLENGTHMEASURE,pos.x), ifcAPI.CreateIfcType(model,IFCLENGTHMEASURE,pos.y),ifcAPI.CreateIfcType(model,IFCLENGTHMEASURE,pos.z)]);
            let placement= ifcAPI.CreateIfcEntity(model, IFCAXIS2PLACEMENT3D, location, null, null);
            

            let solid = ifcAPI.CreateIfcEntity(model, IFCEXTRUDEDAREASOLID, profile, placement, direction, ifcAPI.CreateIfcType(model,IFCPOSITIVELENGTHMEASURE,len));

            let column = ifcAPI.CreateIfcEntity(model,IFCCOLUMN, ifcAPI.CreateIfcType(model, IFCGLOBALLYUNIQUEID,"GUID"), null,ifcAPI.CreateIfcType(model,IFCLABEL,"name"),null, ifcAPI.CreateIfcType(model,IFCLABEL,"label"),  placement, solid,ifcAPI.CreateIfcType(model,IFCIDENTIFIER,"sadf"), null);

            ifcAPI.WriteLine(model, column);
        }
    }
`;