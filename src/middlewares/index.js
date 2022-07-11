const upload = require('./multer.js');

module.exports = { upload };

// app.post('/upload', (req, res) => {
//     if (!result) {
//       return res.json('Failed');
//     }
//     upload.array('animals', 3)(req, res, (err) => {
//       if (err instanceof multer.MulterError)
//         return res.json({ message: 'Error', error: err });
//       if (req.files) reName(req.files, 2);
//       return res.json({
//         message: 'OK',
//         files: req.files,
//       });
//     });
//   });
