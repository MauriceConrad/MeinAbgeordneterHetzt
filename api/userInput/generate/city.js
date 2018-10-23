const fs = require('fs-extra');
const path = require('path');

const schoolDataFile = __dirname + "/../../../data/cities.json";

module.exports = async function generateSchhol() {
  const citiesData = await fs.readJson(schoolDataFile);

  const cityName = citiesData.map(function(parts) {
    const part = parts[Math.randomNumber(0, parts.length, true)];
    return part;
  }).join("");

  const contentDescriptor = {
    description: "Stadt",
    props: {
      value: cityName
    }
  };

  return contentDescriptor;
};
