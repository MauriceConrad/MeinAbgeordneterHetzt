const express = require('express');
const bodyParser = require('./body-parser');
const apiRouter = require('./apiRouter');

const morgan = require('morgan');
const fs = require('fs-extra');

const port = 61943;

const app = express();

app.use(bodyParser);

const __logFile = __dirname + "/log/general.json";
app.use(morgan('tiny', {
  stream: fs.createWriteStream(__logFile)
}));

//const log = new Logger(__dirname + "/log/general.json", app);

app.use("/api", apiRouter);

app.use(express.static(__dirname + "/public"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
