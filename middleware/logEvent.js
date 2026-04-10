const { format } = require("date-fns");
const fsPromises = require("fs").promises;
const fs = require("fs");
const path = require("path");

const logEvent = async (message, fileName) => {
  const dateTime = format(new Date(), "dd-MM-yyyy\tHH:mm:ss");
  const logItem = message + dateTime + "\n";
  console.log(logItem);

  try {
    const logPath = path.join(__dirname, "..", "logs");

    if (!fs.existsSync(logPath)) {
      await fsPromises.mkdir(logPath);
    }
    await fsPromises.appendFile(path.join(logPath, fileName), logItem);
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvent(
    `${req.method} \t ${req.url} \t ${req.headers.origin} \t`,
    "reqLog.txt",
  );
  next();
};

module.exports = { logEvent, logger };
