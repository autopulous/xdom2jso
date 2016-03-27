module xml {
    export const namespaceSeparator:string = ':';

    export enum nodeTypes {
        ELEMENT = 1,
        ATTRIBUTE = 2,
        TEXT = 3,
        CDATA_SECTION = 4,
        ENTITY_REFERENCE = 5,
        ENTITY = 6,
        PROCESSING_INSTRUCTION = 7,
        COMMENT = 8,
        DOCUMENT = 9,
        DOCUMENT_TYPE = 10,
        DOCUMENT_FRAGMENT = 11,
        NOTATION = 12
    }

    export const nodeTypeKeys:string[] = Object.keys(nodeTypes);
    nodeTypeKeys.unshift(undefined);

    export const nodeTypeNames:string[] = [
        undefined,
        "Element",
        "Attribute",
        "Text",
        "CDATA Section",
        "Entity Reference",
        "Entity",
        "Processing Instruction",
        "Comment",
        "Document",
        "Document Type",
        "Document Fragment",
        "Notation"
    ];

    export class xml {
        isNodeType(nodeType) {
            return undefined != nodeTypeKeys[nodeType];
        };

        isNodeTypeKey(nodeTypeKey) {
            return undefined != nodeTypes[nodeTypeKey];
        };

        nodeType(nodeTypeKey) {
            return nodeTypes[nodeTypeKey];
        };

        nodeTypeKey(nodeType) {
            return nodeTypeKeys[nodeType];
        };

        nodeTypeName(nodeType) {
            return nodeTypeNames[nodeType];
        };
    }
}

// https://github.com/Microsoft/TypeScript-Handbook