const fs = require('fs-extra');
const path = require('path');

const subjectDataFile = __dirname + "/../../../data/subject.json";

module.exports = async function generateSchhol() {
  const subjectData = await fs.readJson(subjectDataFile);

  const subject = subjectData.map(function(parts) {
    const part = parts[Math.randomNumber(0, parts.length, true)];
    return part;
  }).join(" ");

  const contentDescriptor = {
    description: "Betreff",
    props: {
      value: subject,
      //className: 'hidden-input'
    },
    parentProps: {
      //className: 'hidden-input'
    }
  };

  return contentDescriptor;
};
