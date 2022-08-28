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

function handleUpload(req, res, next) {
  upload.single('product')(req, res, (err) => {
    if (err instanceof multer.MulterError || !req.file) {
      return res.status(400).json({
        status: 'Error',
        message: !req.file ? 'Invalid file type / no file found' : err,
      });
    }
    next();
  });
}

module.exports = handleUpload;
