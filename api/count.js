const fs = require('fs-extra');

const counterFile = __dirname + "/../data/spams.json";

var pushRequests = [];

module.exports = async function(req, res, next) {
  var count = await fs.readJson(counterFile);

  const methodHandlers = {
    async add() {
      count++;

      for (let request of pushRequests) {
        request.res.json(count);
        request.next();
      }
      pushRequests = [];

      await fs.writeFile(counterFile, JSON.stringify(count));

      res.json(true);
    },
    async push() {
      pushRequests.push({
        res: res,
        next: next
      });
      /*setTimeout(() => {
        //res.end();
        res.status(400).end();
        next();
      }, 5000);*/
    }
  };
  if (req.params.method in methodHandlers) {
    await methodHandlers[req.params.method]();
  }
  else {
    res.json(count);
  }

};
