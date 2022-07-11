const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

function fileFilter(req, file, cb) {
  const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (whitelist.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(null, false);
}

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;

// function handleUpload(req, res, next) {
//   upload.array('animals', 2)(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.json({
//         message: 'Error',
//         Error: err,
//       });
//     }
//     next();
//   });
// }
