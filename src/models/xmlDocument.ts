import { XmlElement, XmlElementWithRelations } from "./xmlElement";

export class XmlDocument {
    private nodes: XmlElement[];

    constructor(children: XmlElementWithRelations[]) {
        this.nodes = [];
        this.flattenXmlTree(children);
    }

    getChildrenOfNode(node: XmlElement): XmlElement[] {
        return this.nodes.filter(x => x.parentId == node.id);
    }

    getRootNodes(): XmlElement[] {
        return this.nodes.filter(x => x.parentId == null);
    }

    private flattenXmlTree(elements: XmlElementWithRelations[]) {
        elements.forEach(el => {
            this.nodes.push(el);

            if (el.children) {
                this.flattenXmlTree(el.children);
            }
            
            /// delete references
            var xmlElement: any = el;
            delete xmlElement.children;
            delete xmlElement.parent;
        });
    }
}