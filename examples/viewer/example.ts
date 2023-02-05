export let exampleCode = `
let EID = 1;

interface pt
{
    x: number, y: number, z: number;
}

interface pt2D
{
    x: number, y: number;
}

function Point(model: number, api: IfcAPI, o: pt): IFC4.IfcCartesianPoint
{
    let pt = api.CreateIfcEntity(model,
        IFCCARTESIANPOINT, 
        [new IFC4.IfcLengthMeasure(o.x), new IFC4.IfcLengthMeasure(o.y), new IFC4.IfcLengthMeasure(o.z)]
    );

    return pt;
}

function Dir(model: number, api: IfcAPI, o: pt): any
{
    let pt = api.CreateIfcEntity(model,
        IFCDIRECTION, 
        [new IFC4.IfcReal(o.x), new IFC4.IfcReal(o.y), new IFC4.IfcReal(o.z)]
    );
    
    return pt;
}

function Point2D(model: number, api: IfcAPI, o: pt2D): any
{
    let pt = api.CreateIfcEntity(model,
        IFCCARTESIANPOINT, 
        [new IFC4.IfcLengthMeasure(o.x), new IFC4.IfcLengthMeasure(o.y)]
    );
    
    return pt;
}

function AxisPlacement(model: number, api: IfcAPI, o: pt): any
{
    let locationID = Point(model, api, o);
    
    let pt = api.CreateIfcEntity(model,
        IFCAXIS2PLACEMENT3D, 
        locationID, 
        null,
        null
    );
    
    return pt;
}

function AxisPlacement2D(model: number, api: IfcAPI, o: pt2D): any
{
    let locationID = Point2D(model, api, o);
    
    let pt = api.CreateIfcEntity(model,
        IFCAXIS2PLACEMENT2D,
        locationID, 
        null
    );
    
    return pt;
}

function Placement(model: number, api: IfcAPI, o: pt)
{
    let axisID = AxisPlacement(model, api, o);
    
    let pt = api.CreateIfcEntity(model,
        IFCLOCALPLACEMENT,
        null,
        axisID
    );

    return pt;
}

function CircleProfile(model: number, api: IfcAPI, rad: number, o: pt2D)
{
    let pt = api.CreateIfcEntity(model,
        IFCCIRCLEPROFILEDEF,
        IFC4.IfcProfileTypeEnum.AREA,
        new IFC4.IfcLabel('column-prefab'),
        AxisPlacement2D(model, api, o),
        new IFC4.IfcPositiveLengthMeasure(rad)
    );
    return pt;
}


function StandardColumn(model: number, api: IfcAPI, pos: pt)
{
    let dir: pt =  { x: 0, y: 0, z: 1 };
    let rad: number = 0.25;
    let len: number = 2;
    let profile = CircleProfile(model, api, rad, { x: 0, y: 0 })
    let placement = AxisPlacement(model, api, pos)
    let direction = Dir(model, api, dir)

    let solid = api.CreateIfcEntity(model,
        IFCEXTRUDEDAREASOLID,
        profile,
        placement,
        direction
        new IFC4.IfcPositiveLengthMeasure(len)
    );
        
    let column = api.CreateIfcEntity(model,
        IFCCOLUMN,
        new IFC4.IfcGloballyUniqueId("GUID"),
        null,
        new IFC4.IfcLabel("name"),
        null,
        new IFC4.IfcLabel("label"),
        Placement(model, api, pos),
        solid,
        new IFC4.IfcIdentifier("sadf"),
        null
    );
    
    api.WriteLine(model, column);
}

function BuildModel(model: number, api: IfcAPI)
{
    console.log("Building model " + model);

    const gridSize = 6;

    for (let i = 0; i < gridSize; i++)
    {
        for (let j = 0; j < gridSize; j++)
        {
            StandardColumn(model, api, {x: i, y: j, z: 0});
        }
    }
}

`;