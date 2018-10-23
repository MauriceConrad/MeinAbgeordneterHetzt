const fs = require('fs-extra');

const servicesSourceFile = __dirname + "/../data/services.json";

module.exports = async function(req, res, next) {
  const services = await fs.readJson(servicesSourceFile);

  res.json(services);

  next();
};
