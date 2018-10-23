const {  } = require('./helper');

const baseObjSymbol = Symbol("baseObj");

class ObjectNode {
  constructor(baseObj, children, parentNode) {
    Object.defineProperty(this, "baseObj", {
      value: baseObj,
      enumerable: false
    });

    Object.defineProperty(this, "attributes", {
      get() {
        return this.getAttributes();
      },
      enumerable: true
    });

    this.children = [];
    if (children) {
      for (let child of children) {
        const childNode = new ObjectNode(child, child.children, this);
        this.children.push(childNode);
      }
    }

    this.parentNode = parentNode;

    this.type = this.baseObj.type;

    const typeHandlers = {
      tag: () => {
        this.tagName = this.baseObj.name;
      },
      text: () => {
        this.content = this.baseObj.raw;
      }
    };
    if (this.type in typeHandlers) {
      typeHandlers[this.type]();
    }
    else {
      //console.log("\n\n\n", this.type);
    }

  }
  get childNodes() {
    return this.children.filter(child => child.type === "tag");
  }
  get childTexts() {
    return this.children.filter(child => child.type === "text");
  }
  get innerText() {
    function getInnerText(node) {
      return node.children.map(function(child) {
        if (child.type === "tag") {
          return getInnerText(child);
        }
        else if (child.type === "text") {
          return child.content;
        }
      }).join("\n");
    }

    return getInnerText(this);

    return this.childTexts.map(child => child.content).join("");
  }
  get innerHTML() {
/*
    function getInner(node) {
      //console.log(node);
      var str = "";
      str += "<" + node.baseObj.raw + ">\n" + node.children.map(function(child) {
        return getInner(child.children);
      }).join("\n") + "</" + node.tagName + ">";
      return str;
    }
    return getInner(this);
    //console.log(this.baseObj);*/
    return this.childTexts.map(node => node.content).join("");
  }
  getAttributes() {
    const attributes = {};

    if (this.baseObj.data) {
      const attributesRaw = this.baseObj.data.matchAll(/\s([a-z]*)=("|')([^"']*)("|')/) || [];

      for (let attrMatch of attributesRaw) {
        attributes[attrMatch[1]] = attrMatch[3];
      }
    }

    return attributes;
  }
  get classList() {
    return (this.attributes.class || "").split(" ");
  }
  getElementsById(id) {
    return ObjectNode.loopTroughChilds(this.children, function(child) {
      return child.attributes.id === id;
    });
  }
  getElementsByTagName(tagName) {
    return ObjectNode.loopTroughChilds(this.children, function(child) {
      return child.tagName === tagName;
    });
  }
  getElementsByAttributeValue(attrName, value) {
    return ObjectNode.loopTroughChilds(this.children, function(child) {
      return child[attrName] === value;
    });
  }
  closestByHandler(handler) {
    var currNode = this;
    while (!handler(currNode)) {
      currNode = currNode.parentNode;
      if (!currNode) {
        return;
      }
    }
    return currNode;
  }
  getElementsByHandler(handler) {
    return ObjectNode.loopTroughChilds(this.children, handler);
  }
  static loopTroughChilds(children, handler) {
    const results = [];
    function loop(childs) {
      if (childs) {
        for (let child of childs) {
          if (handler(child)) {
            results.push(child);
          }
          loop(child.children);
        }
      }
    }
    loop(children);

    return results;
  }
}

module.exports = ObjectNode;
