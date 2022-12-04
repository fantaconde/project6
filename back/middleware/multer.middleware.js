//define multer to help upload the images

const multer = require("multer");

//Specify the file types
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//define the storage path for the images
const storage = multer.diskStorage({
  //define the storage location
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  //give the file a unique name
  filename: (req, file, cb) => {
    // const extension = MIME_TYPES[file.mimetype];
    const name = file.originalname.split(" ").join("_");
    cb(null, Date.now() + "--" +name);
  },
});

//define the file filter to accept only images
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype.includes("jpeg") ||
//     file.mimetype.includes("png") ||
//     file.mimetype.includes("jpg")
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

//define the upload variable
// let upload = multer({ storage: storage, fileFilter: fileFilter });
let upload = multer({ storage: storage});

//upload a single file
const uploadMiddleware = upload.single("image");

module.exports = uploadMiddleware;
