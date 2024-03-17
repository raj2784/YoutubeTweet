import multer from "multer";

// custom middle ware

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function name(req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({storage: storage});
