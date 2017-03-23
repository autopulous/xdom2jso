module xdom2jso {
    export enum nodeTypes {
        UNDEFINED = 0,
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
    export function convert(xmlRoot:Node, localName?:boolean):{} {
        if (undefined !== localName) this.localName = localName;

        var jsoRoot:{} = {};
        convertNodes(jsoRoot, xmlRoot);
        return jsoRoot;
    }

    var localName:boolean = false;

    function convertNodes(jso:any, node:Node) {
        var nodeType:number = node.nodeType;
        var nodeName:string = this.localName ? node.localName : node.nodeName;

        if (nodeTypes.ELEMENT === nodeType) {
            var jsoNode:any = {};

            var attributeNodes:NamedNodeMap = node.attributes;
            var attributeIndex:number = attributeNodes.length;

            if (0 < attributeIndex) {
                var attributes:any = {};

                for (var attributeIndex:number = 0; attributeNodes.length > attributeIndex; ++attributeIndex) {
                    var attribute:Attr = attributeNodes.item(attributeIndex);
                    attributes[this.localName ? attribute.localName : attribute.nodeName] = attribute.value;
                }

                jsoNode['_'] = attributes;
            }

            var childNodes:NodeList = node.childNodes;

            for (var childIndex:number = 0; childNodes.length > childIndex; ++childIndex) {
                convertNodes(jsoNode, childNodes[childIndex]);
            }

            if (undefined === jso[nodeName]) {
                jso[nodeName] = jsoNode;
            }
            else {
                if (Array !== jso[nodeName].constructor) {
                    var jsoFirstNode:{} = jso[nodeName];

                    jso[nodeName] = [];
                    jso[nodeName].push(jsoFirstNode);
                }

                jso[nodeName].push(jsoNode);
            }
        }
        else if (nodeTypes.TEXT === nodeType) {
            var nodeValue:string = node.nodeValue;

            if (/\S/.test(nodeValue)) {
                jso['$'] = nodeValue.trim();
            }
        }
    }
}