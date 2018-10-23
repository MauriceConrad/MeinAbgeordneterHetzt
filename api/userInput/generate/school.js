const fs = require('fs-extra');
const path = require('path');

const schoolDataFile = __dirname + "/../../../data/school.json";

module.exports = async function generateSchhol() {
  const schoolData = await fs.readJson(schoolDataFile);

  const schoolName = schoolData.map(function(parts) {
    const part = parts[Math.randomNumber(0, parts.length, true)];
    return part;
  }).join(" ");

  const contentDescriptor = {
    description: "Schule",
    props: {
      value: schoolName
    }
  };

  return contentDescriptor;
};
