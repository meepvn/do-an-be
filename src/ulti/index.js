const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function reName(file, productId) {
  const extension = file.filename.split('.').pop();
  const newName = `SP${productId}.${extension}`;
  fs.renameSync(`public/images/${file.filename}`, `public/images/${newName}`);
  return newName;
}

function deleteImage(fileName) {
  try {
    fs.unlinkSync(`./public/images/${fileName}`);
  } catch (err) {
    return new Error(err);
  }
}

function generateToken(data) {
  const token = jwt.sign(data, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
  return token;
}

function generateRefreshToken(data) {
  const token = jwt.sign(data, process.env.REFRESH_TOKEN, { expiresIn: '5s' });
  return token;
}
const cookieOptions = {
  sameSite: 'none',
  secure: true,
  expires: new Date(Date.now() + 1000 * 60 * 24),
  httpOnly: true,
  path: `/api/user/`,
};
module.exports = {
  reName,
  generateToken,
  generateRefreshToken,
  cookieOptions,
  deleteImage,
};
