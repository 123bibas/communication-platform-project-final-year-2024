const multer = require("multer");

const uploadFunc = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 100, // 1 MB
  },
});

module.exports = uploadFunc;
