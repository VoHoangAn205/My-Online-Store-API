const { logEvent } = require("./logEvent");

const errorHandler = (err, req, res, next) => {
  res.status(500).send(err.message);
  logEvent(
    `${req.method} \t ${req.url} \t ${req.headers.origin} \t ${err.name} \t ${err.message}`,
    "errLog.txt",
  );
  console.error(err.stack);
};
module.exports = errorHandler;
