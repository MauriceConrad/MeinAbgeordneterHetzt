const fs = require('fs-extra');


class Logger {
  constructor(path, expressApp) {
    this.path = path;

    fs.ensureFileSync(this.path);

    console.log(this.log);

    expressApp.use((req, res, next) => {
      this.logger(req, res, next, this);
    });
  }
  get log() {
    try {
      return fs.readJsonSync(this.path);
    }
    catch (e) {
      return [];
    }
  }
  set log(jsonData) {
    return fs.writeJsonSync(this.path, jsonData);
  }
  add(record) {
    this.log = this.log.concat(record);
  }
  clear() {
    this.log = [];
  }
  logger(req, res, next, self) {

    const record = {
      time: Date.now(),
      method: req.method,
      url: req.url,
      remoteAddress: req.connection.remoteAddress,
      //headers: req.headers,
      //body: req.body.toString("base64")
    };

    self.add(record);

    next();
  }
}

module.exports = Logger;
