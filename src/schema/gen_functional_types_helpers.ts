export function sortEntities(entities) {
  let sortedEntities = [];
  let unsortedEntities = [];
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

export function generateClass(entity, buffer, types, schemaName) 
{

  if (!entity.parent)
  {
    buffer.push(`\texport class ${entity.name} {`);
    buffer.push(`\t\texpressID: number;`);
    buffer.push(`\t\ttype: number;`);
  } 
  else
  {
    buffer.push(`\texport class ${entity.name} extends ${schemaName}.${entity.parent} {`);
  }
  
  entity.props.forEach((param) => {
    let isType: Type = types.some( x => x.name == param.name);
    let propType = `${(isType || param.primitive) ? param.type : "(Handle<" + schemaName + "."+ param.type + `> | ${schemaName}.${param.type})` }${param.set ? "[]" : ""} ${param.optional ? "| null" : ""}`;
    buffer.push(`\t\t${param.name}: ${propType};`)
  });
  
  entity.inverseProps.forEach((prop) => {
    let type = `${"(Handle<" + schemaName + "."+ prop.type + `> | ${schemaName}.${prop.type})` }${prop.set ? "[]" : ""} ${"| null"}`;
    buffer.push(`\t\t${prop.name}: ${type};`);
  });

  buffer.push(`\t\tconstructor(expressID: number, type: number, ${entity.derivedProps.map((p) => `${p.name}: ${(types.some( x => x.name == p.name) || p.primitive) ? p.type : "(Handle<" + schemaName + "."+ p.type + `> | ${schemaName}.${p.type})` }${p.set ? "[]" : ""} ${p.optional ? "| null" : ""}`).join(", ")})`)
  buffer.push(`\t\t{`)
  if (!entity.parent)
  {
    buffer.push(`\t\t\tthis.expressID = expressID;`);
    buffer.push(`\t\t\tthis.type = type;`);
  } else {
    var nonLocalProps = entity.derivedProps.filter(n => !entity.props.includes(n))
    if (nonLocalProps.length ==0) buffer.push(`\t\t\tsuper(expressID,type);`);
    else buffer.push(`\t\t\tsuper(expressID,type,${nonLocalProps.map((p) => `${p.name}`).join(", ")});`)
  }
  entity.props.forEach((param) => {
      buffer.push(`\t\t\tthis.${param.name} = ${param.name};`)
  });
  
  buffer.push(`\t\t}`)
  buffer.push(`\t\tstatic FromTape(expressID: number, type: number, tape: any[]): ${entity.name}`)
  buffer.push(`\t\t{`);
  buffer.push(`\t\t\tlet ptr = 0;`);
  buffer.push(`\t\t\treturn new ${entity.name}(expressID, type, ${entity.derivedProps.map((p) => 'tape[ptr++]').join(", ")});`);
  buffer.push(`\t\t}`)
  buffer.push(`\t\tToTape(): any[]`)
  buffer.push(`\t\t{`)
  buffer.push(`\t\t\tlet args: any[] = [];`)
  buffer.push(`\t\t\targs.push(${entity.derivedProps.map((p) => `this.${p.name}`).join(", ")});`);
  buffer.push(`\t\t\treturn args;`)
  buffer.push(`\t\t}`)
  buffer.push(`\t};`);
}

export function makeCRCTable(){
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

export function crc32(str,crcTable) {
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++ ) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
}

export function expTypeToTSType(expTypeName)
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

export function parseInverse(line,entity) 
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

export function parseElements(data)
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
            parseInverse(line,entity);
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

            let split = line.split(" ").map((s) => s.trim());
            let name = split[1];


            let isList = split.indexOf("LIST") != -1 || split.indexOf("SET") != -1 || split.indexOf("ARRAY") != -1;
            let isEnum = split.indexOf("ENUMERATION") != -1;
            let isSelect = split[3].indexOf("SELECT") == 0;
            let values: null | string[] = null;

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
                values = stringList.split(",").map((s) => s.trim());
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

            typeName = expTypeToTSType(typeName);
            
            type = {
                name,
                typeName,
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

function findEntity(entityName: String, entityList: Entity[])
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
