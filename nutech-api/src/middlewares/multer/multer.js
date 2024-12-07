const multer = require("multer");

const diskStorage = multer.diskStorage;

const allowedFileExtension = ["png", "PNG", "JPEG", "jpeg", "JPG", "jpg"];
const fileFilterOption = (req, file, cb) => {
  const ext = file.originalname.split(".").pop();

  if (!allowedFileExtension.includes(ext)) {
    req.errorValidateFile = "Format Image tidak sesuai";
    return cb(null, false);
  }

  cb(null, true);
};

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(" ").join("_");
    cb(null, `${fileName}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1000 * 1000,
  },
  fileFilter: fileFilterOption,
});

module.exports = upload;
