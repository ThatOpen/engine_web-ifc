
// We cannot support all the IFC schema version - especially deprecated and RC releases - doing so would massive increase the bundle size. 
// So instead we alias them to the "best effort" parser

type SchemaAlias = { schemaName: string, alias:string}

const schemaAliases : Array<SchemaAlias>  = [

{ schemaName : "IFC2X_FINAL", alias : "IFC2X3"},
{ schemaName : "IFC4X1", alias : "IFC4X3"},
{ schemaName : "IFC4X2", alias :"IFC4X3"},
{ schemaName : "IFC4X3_RC3", alias :"IFC4X3"},
{ schemaName : "IFC4X3_RC4", alias :"IFC4X3"},
{ schemaName : "IFC4X3_RC1", alias :"IFC4X3"},
{ schemaName : "IFC4X3_RC2", alias :"IFC4X3"},
{ schemaName : "IFC4X3_ADD2", alias :"IFC4X3"},
{ schemaName : "IFC4X3_ADD1", alias :"IFC4X3"}

];

export default schemaAliases;
