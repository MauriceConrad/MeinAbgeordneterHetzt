const fs = require('fs-extra');

const {  } = require('../helper');

const inputTypesSourceFile = __dirname + "/userInput/input-types.json";
const contentTypeRecords = fs.readJsonSync(inputTypesSourceFile);

module.exports = async function(req, res, next) {
  const contentTypeName = req.params.method;

  if (!contentTypeName) {
    return res.json({
      err: "Invalid content-type",
      code: 0
    });
  }

  const relatedTypeRecord = contentTypeRecords[contentTypeRecords.indexOfKey("name", contentTypeName)];

  var result;

  try {
    const typeContentHandler = require(__dirname + "/userInput/" + relatedTypeRecord.fill);

    const itemObj = JSON.parse(req.body.toString());

    result = await typeContentHandler(itemObj);
  }
  catch (e) {
    console.error(e);
    result = null;
  }

  res.json(result);

  next();
};
