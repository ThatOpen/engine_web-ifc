import {Entity, Type, Prop} from "./gen_functional_types_interfaces";


export function generateInitialiser(type: Type, initialisersDone: Set<string>,buffer: Array<string>, crcTable:any,types: Type[]) 
{
    if (type.isEnum) return;

    if (type.isList)
    {
        if (initialisersDone.has(type.name)) return;
        buffer.push(`\tTypeInitialisers[${crc32(type.name.toUpperCase(),crcTable)}] = (v: any) => { return new ${type.name}(v); }`);
        return
    }

    if (type.isSelect)
    {
        type.values.forEach(refType => {
           let newType = types.find(e => e.name == refType);
           if (newType) generateInitialiser(newType,initialisersDone,buffer,crcTable,types)
        });
        return;
    }

    if (initialisersDone.has(type.name)) return;
    initialisersDone.add(type.name);
    buffer.push(`\tTypeInitialisers[${crc32(type.name.toUpperCase(),crcTable)}] = (v: any) => { return new ${type.name}(v); }`);
    return;
}       

export function generatePropAssignment(p: Prop, i:number, types:Type[]) 
{
    let isType: boolean = types.some( (x:Type) => x.name == p.type);
    let type = types.find( (x:Type) => x.name == p.type);
    let content:string;   
    if (type?.isEnum) 
    {
        content='_tape['+i+']';
        return content;
    }

    let prefix = '';
    if (p.optional) prefix ='!_tape['+i+'] ? null :'

    if (p.set)
    {
        content = '_tape['+i+'].map((p:any) => '
        if (type?.isSelect){
            let isEntitySelect = type?.values.some(refType => types.findIndex( t => t.name==refType)==-1);
            if (isEntitySelect) content+='new Handle(p.value)';
            else content+='TypeInitialiser(p)';
        }
        else if (isType) content+='new '+p.type+'(p.value)';
        else if (p.primitive) content+='p.value';
        else content+='new Handle<'+p.type+'>(p.value)';
        content +=')';
    }
    else if (type?.isSelect)
    {
        let isEntitySelect = type?.values.some(refType => types.findIndex( t => t.name==refType)==-1);
        if (isEntitySelect) content='new Handle(_tape['+i+'].value)';
        else content='TypeInitialiser(_tape['+i+'])'

    }
    else if (isType) content='new '+p.type+'(_tape['+i+'].value)';
    else if (p.primitive) content='_tape['+i+'].value';
    else content='new Handle<'+p.type+'>(_tape['+i+'].value)';
    return prefix + content;
}

export function sortEntities(entities: Array<Entity>) {
  let sortedEntities: Array<Entity> = [];
  let unsortedEntities: Array<Entity> = [];
  entities.forEach(val => unsortedEntities.push(val));
  while (unsortedEntities.length > 0)
  {
    for (let i=0; i < unsortedEntities.length; i++) 
    {
      if (unsortedEntities[i].parent == null || sortedEntities.some( e => e.name === unsortedEntities[i].parent))
      {
        sortedEntities.push(unsortedEntities[i]);
      }
    }
    unsortedEntities = unsortedEntities.filter(n => !sortedEntities.includes(n));
  }
  return sortedEntities;
}

export function generateTapeAssignment(p: Prop, types:Type[]) 
{
    let type = types.find( (x:Type) => x.name == p.type);
    if (p.set && type?.isSelect)
    {
        let isEntitySelect = type?.values.some(refType => types.findIndex( t => t.name==refType)==-1);
        if (isEntitySelect)  return `this.${p.name}`;
        let prefix='';
        if (p.optional) prefix ='!this.'+p.name+' ? null :'
        return prefix + 'this.'+p.name+'.map((p:any) => Labelise(p))'
    }
    else if (type?.isSelect)
    {
        let isEntitySelect = type?.values.some(refType => types.findIndex( t => t.name==refType)==-1);
        if (isEntitySelect)  return `this.${p.name}`;
        let prefix='';
        if (p.optional) prefix ='!this.'+p.name+' ? null :'
        return prefix + 'Labelise(this.'+p.name+')';
    }
    return `this.${p.name}`;
}


export function generateClass(entity:Entity, buffer: Array<string>, types:Type[]) 
{

  if (!entity.parent)
  {
    buffer.push(`\texport class ${entity.name} extends IfcLineObject {`);
  } 
  else
  {
    buffer.push(`\texport class ${entity.name} extends ${entity.parent} {`);
  }
  
  entity.props.forEach((param) => {
    let isType: boolean = types.some( (x:Type) => x.name == param.type);
    let propType = `${(isType || param.primitive) ? param.type : "(Handle<"  +  param.type + `> | ${param.type})` }${param.set ? "[]" : ""} ${param.optional ? "| null" : ""}`;
    buffer.push(`\t\t${param.name}: ${propType};`)
  });
  
  entity.inverseProps.forEach((prop) => {
    let type = `${"(Handle<" + prop.type + `> | ${prop.type})` }${prop.set ? "[]" : ""} ${"| null"}`;
    buffer.push(`\t\t${prop.name}!: ${type};`);
  });

  buffer.push(`\t\tconstructor(expressID: number, type: number, ${entity.derivedProps.map((p) => `${p.name}: ${(types.some( x => x.name == p.type) || p.primitive) ? p.type : "(Handle<" + p.type + `> | ${p.type})` }${p.set ? "[]" : ""} ${p.optional ? "| null" : ""}`).join(", ")})`)
  buffer.push(`\t\t{`)
  if (!entity.parent) {
    buffer.push(`\t\t\tsuper(expressID,type);`)
  } else {
    var nonLocalProps = entity.derivedProps.filter(n => !entity.props.includes(n))
    if (nonLocalProps.length ==0) buffer.push(`\t\t\tsuper(expressID,type);`);
    else buffer.push(`\t\t\tsuper(expressID,type,${nonLocalProps.map((p) => `${p.name}`).join(", ")});`)
  }
  entity.props.forEach((param) => {
      buffer.push(`\t\t\tthis.${param.name} = ${param.name};`);
  });
  
  buffer.push(`\t\t}`)
  buffer.push(`\t\tstatic FromTape(expressID: number, type: number, _tape: any[]): ${entity.name}`)
  buffer.push(`\t\t{`);
  buffer.push(`\t\t\treturn new ${entity.name}(expressID, type, ${entity.derivedProps.map((p, i) => generatePropAssignment(p,i,types)).join(", ")});`);
  buffer.push(`\t\t}`)
  buffer.push(`\t\tToTape(): unknown[]`)
  buffer.push(`\t\t{`)
  buffer.push(`\t\t\treturn [${entity.derivedProps.map((p) =>generateTapeAssignment(p,types)).join(", ")}];`)
  buffer.push(`\t\t}`)
  buffer.push(`\t}`);
}

export function makeCRCTable(){
    var c;
    var crcTable: Array<number> = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

export function crc32(str:string,crcTable:Array<number> ) {
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++ ) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
}

export function expTypeToTSType(expTypeName:string)
{
    let tsType = expTypeName;
    if (expTypeName == "REAL" || expTypeName == "INTEGER" || expTypeName == "NUMBER")
    {
        tsType = "number";
    }
    else if (expTypeName == "STRING")
    {
        tsType = "string";
    }
    else if (expTypeName == "BOOLEAN")
    {
        tsType = "boolean";
    }
    else if (expTypeName == "BINARY")
    {
        tsType = "number";
    }
    else if (expTypeName == "LOGICAL")
    {
        tsType = "boolean";
    }

    return tsType;
}

export function expTypeToTypeNum(expTypeName:string) : number
{
    if (expTypeName == "REAL" || expTypeName == "INTEGER" || expTypeName == "NUMBER") return 4;
    else if (expTypeName == "STRING") return 1;
    else if (expTypeName == "BOOLEAN") return 3;
    else if (expTypeName == "BINARY") return 4;
    else if (expTypeName == "LOGICAL") return 3;
    return 0;
}

export function parseInverse(line:string,entity:Entity) 
{
    let split = line.split(" ");
    let name = split[0].replace("INVERSE","").trim();
    let set = split.indexOf("SET") != -1 || split.indexOf("LIST") != -1;
    let forVal = split[split.length - 1].replace(";", "");
    let type = split[split.length - 3];
    let tsType = expTypeToTSType(type);
    entity.inverseProps.push({
      name,
      type: tsType,
      set,
      for: forVal
    });  
}

export function parseElements(data:string)
{
    let lines = data.split(";");

    let entities: Entity[] = [];
    let types: Type[] = [];
    let type: Type | false = false;
    let entity: Entity | false = false;
    let readProps = false;
    let readInverse = false;

    for (let i = 0; i < lines.length; i++)
    {
        let line = lines[i].trim();
        let hasColon = line.indexOf(" : ") != -1;
        if (line.indexOf("ENTITY") == 0)
        {
            let split = line.split(" ");
            let name = split[1].trim();
            entity = {
                name,
                parent: null,
                props: [],
                children: [],
                derivedProps: [],
                inverseProps: [],
                derivedInverseProps: [],
                isIfcProduct: false
            };
            if (name === "IfcProduct") entity.isIfcProduct = true;
            readProps = true;
            readInverse = false;

            let subIndex = split.indexOf("SUBTYPE");
            if (subIndex != -1)
            {
                let parent = split[subIndex + 2].replace("(", "").replace(")", "");
                entity.parent = parent;
            }
        }
        else if (line.indexOf("END_ENTITY") == 0)
        {
            if (entity) entities.push(entity);
            readProps = false;
            readInverse = false;
        }
        else if (line.indexOf("WHERE") == 0)
        {
            readProps = false;
            readInverse = false;
        }
        else if (line.indexOf("INVERSE") == 0)
        {
            readProps = false;
            readInverse = true;
            // there is one inverse property on this line
            if (entity) parseInverse(line,entity);
        }
        else if (line.indexOf("DERIVE") == 0)
        {
            readProps = false;
            readInverse = false;
        }
        else if (line.indexOf("UNIQUE") == 0)
        {
            readProps = false;
            readInverse = false;
        }
        else if (line.indexOf("TYPE") == 0)
        {
            readProps = false;
            readInverse = false;

            let split = line.split(" ").map((s:string) => s.trim());
            let name = split[1];


            let isList = split.indexOf("LIST") != -1 || split.indexOf("SET") != -1 || split.indexOf("ARRAY") != -1;
            let isEnum = split.indexOf("ENUMERATION") != -1;
            let isSelect = split[3].indexOf("SELECT") == 0;
            let values: string[] = [];

            let typeName = "";
            if (isList)
            {
                typeName = split[split.length - 1];
            }
            else if (isEnum || isSelect)
            {
                let firstBracket = line.indexOf("(");
                let secondBracket = line.indexOf(")");

                let stringList = line.substring(firstBracket + 1, secondBracket);
                values = stringList.split(",").map((s:string) => s.trim());
            }
            else
            {
                typeName = split[3];
            }

            let firstBracket = typeName.indexOf("(");
            if (firstBracket != -1)
            {
                typeName = typeName.substr(0, firstBracket);
            }

            let typeNum = expTypeToTypeNum(typeName);
            typeName = expTypeToTSType(typeName);
            type = {
                name,
                typeName,
                typeNum,
                isList,
                isEnum,
                isSelect,
                values
            }
        }
        else if (line.indexOf("END_TYPE") == 0)
        {
            if (type)
            {
                types.push(type);
            }
            type = false;
        }
        else if (entity && readInverse && hasColon) 
        {
          parseInverse(line,entity);
        }
        else if (entity && readProps && hasColon)
        {
            // property
            let split = line.split(" ");
            let name = split[0];
            let optional = split.indexOf("OPTIONAL") != -1;
            let set = split.indexOf("SET") != -1 || split.indexOf("LIST") != -1;
            let type = split[split.length - 1].replace(";", "");
            let firstBracket = type.indexOf("(");
            if (firstBracket != -1)
            {
                type = type.substr(0, firstBracket);
            }
            let tsType = expTypeToTSType(type);
            entity.props.push({
                name,
                type: tsType,
                primitive: tsType !== type,
                optional,
                set
            })
        }
    }

    return {
        entities,
        types
    };
}

function findEntity(entityName: String | null, entityList: Entity[])
{
  if (entityName == null) return null;
  for (var i=0; i < entityList.length;i++) 
  {
      if (entityList[i].name == entityName)
      {
        return entityList[i];
      }
  }
  return null;
}

export function findSubClasses(entities: Entity[])
{
  for (var y = entities.length-1; y >= 0; y-- ) 
  {
      let parent = findEntity(entities[y].parent,entities);
      if (parent == null) continue;
      parent.children.push( ... entities[y].children );
      parent.children.push(entities[y].name)
  }
  return entities;
}

export function walkParents(entity: Entity, entityList: Entity[])
{
    let parent = findEntity(entity.parent,entityList);
    if (parent == null) {
      entity.derivedProps  = entity.props;
      entity.derivedInverseProps = entity.inverseProps;
    } else {
      walkParents(parent, entityList);
      if (parent.isIfcProduct) entity.isIfcProduct = true;
      entity.derivedProps = [...parent.derivedProps, ...entity.props];
      entity.derivedInverseProps = [...parent.derivedInverseProps,...entity.inverseProps];
    }
}
