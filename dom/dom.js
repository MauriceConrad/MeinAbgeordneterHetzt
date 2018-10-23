const ObjectNode = require('./node');

class DOM {
  constructor(html) {
    this.root = DOM.createNode({}, html);

    //console.log(this.root.getElementsById("cntctfrm_contact_email"));

    
  }
  static createNode(obj, childs) {
    return new ObjectNode(obj, childs);
  }
};


module.exports = DOM;
