const fs = require('fs');
function reName(arr, productId) {
  arr.forEach((file, index) => {
    const extension = file.filename.split('.').pop();
    const newName = `SP${productId}A${index + 1}.${extension}`;
    fs.renameSync(`public/images/${file.filename}`, `public/images/${newName}`);
  });
}

module.exports = { reName };
