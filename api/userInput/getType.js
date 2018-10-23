const fs = require('fs-extra');

const inputTypesSourceFile = __dirname + "/input-types.json";

const contentTypes = fs.readJsonSync(inputTypesSourceFile);


module.exports = function getInputType(node) {

  const relatedWrapContainer = node.closestByHandler(function(parent) {
    return parent.innerText.length < 100 && parent.innerText.search(/[a-z]{3,}/i) > -1;
    return //parent.classList.includes("cntctfrm_field_wrap");
  });

  var labelText;

  if (relatedWrapContainer) {
    labelText = relatedWrapContainer.innerText;
  }

  //console.log(node.attributes.id);

  const generalInfo = [
    node.attributes.type,
    node.attributes.placeholder,
    node.tagName,
    labelText
  ].concat(node.classList).concat(node.attributes.name, node.attributes.id).filter(item => item);

  // Get best fitting type of content
  const bestType = getBestFittingType(contentTypes, generalInfo);

  bestType.labelText = labelText;

  if (bestType.rank === 0) {
    return {
      name: "undefined",
      rank: 0
    };
  }

  //console.log(node.tagName, node.attributes.name, labelText, bestType, "\n");

  return bestType;
};

function getBestFittingType(types, info) {
  //console.log("!", info);

  // Loop trough types
  for (let type of types) {
    //console.log("  --> " + type.name);
    // Initialize rank with 0
    type.rank = 0;
    // Loop trough keywords of this type
    for (let keyword of type.keywords) {
      //console.log("    \"" + keyword + "\"");
      const keywordRegExp = new RegExp(keyword, "i");
      // Loop trough info items of the info items list
      for (let infoItem of info) {
        // Search for te keyword withn the info item
        const itemKeywordMatch = infoItem.match(keywordRegExp);
        // If the search is succesfully, rank up
        if (itemKeywordMatch) {
          type.rank++;
        }
        //console.log("'" + infoItem + "': ", keywordRegExp, itemKeywordMatch);
      }
      //console.log("\n\n");
    }
  }

  return types.sort((a, b) => a.rank < b.rank ? 1 : -1)[0];
}
