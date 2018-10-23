module.exports = function(req, res, next) {
  const bodyBuffers = [];

  req.on("data", function(chunk) {
    bodyBuffers.push(chunk);
  });
  req.on("end", function() {
    req.body = Buffer.concat(bodyBuffers);
    next();
  });
};
