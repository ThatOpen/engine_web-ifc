
interface Type {
    name: string;
    typeName : string;
    isList: boolean;
    isEnum: boolean;
    isSelect: boolean;
    values: string[];
}

interface Prop {
    name: string;
    type: string;
    primitive: boolean;
    optional: boolean;
    set: boolean;
}

interface InverseProp {
    name: string;
    type: string;
    set: boolean;
    for: string;
}

interface Entity {
    name: string;
    parent: null | string;
    children: string[];
    props: Prop[];
    inverseProps: InverseProp[],
    derivedProps: Prop[] | null;
    derivedInverseProps: InverseProp[] | null,
    isIfcProduct: boolean;
}

interface Param
{
    name: string;
    type: string;
    prop: Prop;
    isType: Type;
}