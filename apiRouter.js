const express = require('express');
const fs = require('fs-extra');


const router = express.Router();

const endpointsList = __dirname + "/api/endpoints.json";
const endpoints = fs.readJson(endpointsList);

(async () => {
  for (let endpoint in await endpoints) {
    if ((await endpoints).hasOwnProperty(endpoint)) {
      const endpointHandler = require((await endpoints)[endpoint]);
      router.all("/" + endpoint + "/:method?", async function(req, res, next) {
        endpointHandler(req, res, next);

      });
    }
  }
})();

module.exports = router;
