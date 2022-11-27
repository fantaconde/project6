//define multer to help upload the images

const multer = require("multer");

//define the storage path for the images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

//define the file filter to accept only images
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("jpeg") ||
    file.mimetype.includes("png") ||
    file.mimetype.includes("jpg")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//define the upload variable
let upload = multer({ storage: storage, fileFilter: fileFilter });

const uploadMiddleware = upload.single("image");

module.exports = uploadMiddleware;
