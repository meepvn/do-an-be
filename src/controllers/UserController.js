const userModel = require('../models/User');
const accountModel = require('../models/Account');
const bcrypt = require('bcryptjs');
const checkRequestBody = (req) => {
  if (
    !req.body.TenTaiKhoan ||
    !req.body.MatKhau ||
    !req.body.Email ||
    !req.body.HoTen ||
    !req.body.SDT ||
    !req.body.DiaChi
  )
    return false;
  return true;
};

class UserController {
  async getAllUsers(req, res) {
    const result = await userModel.getAll();
    res.json({
      status: 'OK',
      result,
    });
  }
  async register(req, res) {
    if (!checkRequestBody(req))
      return res.json({
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    const { HoTen, SDT, DiaChi, TenTaiKhoan, Email, MatKhau } = req.body;

    const isPhoneNumberExist = await userModel.findUserByPhoneNumber(SDT);
    if (isPhoneNumberExist > 0 || isPhoneNumberExist instanceof Error) {
      return res.json({
        status: 'Error',
        message: isPhoneNumberExist?.message ?? 'Số điện thoại đã tồn tại',
      });
    }

    const areUserNameAndEmailExist = await accountModel.findByUsernameOrEmail(
      TenTaiKhoan,
      Email
    );
    if (
      areUserNameAndEmailExist > 0 ||
      areUserNameAndEmailExist instanceof Error
    ) {
      return res.json({
        status: 'Error',
        message:
          areUserNameAndEmailExist?.message ?? 'Tài khoản / Email đã tồn tại',
      });
    }

    const insertUserResult = await userModel.insert(HoTen, SDT, DiaChi);
    if (insertUserResult instanceof Error)
      return res.json({
        status: 'Error',
        message: insertUserResult.message,
      });

    const { insertId } = insertUserResult;
    const insertAccountResult = await accountModel.insert(
      insertId,
      TenTaiKhoan,
      MatKhau,
      Email,
      0
    );
    if (insertAccountResult instanceof Error) {
      await userModel.deleteById(insertId);
      return res.json({
        status: 'Error',
        message: insertAccountResult.message,
      });
    }
    return res.json({
      status: 'OK',
      result: insertAccountResult,
    });
  }
  async login(req, res) {
    if (!req.body.TenTaiKhoan || !req.body.MatKhau)
      return res.json({
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    const { TenTaiKhoan, MatKhau } = req.body;
    const matchedAccount = await accountModel.getAccountByUserNameOrEmail(
      TenTaiKhoan,
      TenTaiKhoan
    );
    if (!matchedAccount || matchedAccount instanceof Error)
      return res.json({
        status: 'Error',
        message: matchedAccount?.message ?? 'Tài khoản/email không tồn tại',
      });
    const arePasswordsMatch = await bcrypt.compare(
      MatKhau,
      matchedAccount.MatKhau
    );
    if (!arePasswordsMatch)
      return res.json({
        status: 'Error',
        message: 'Tài khoản hoặc mật khẩu không đúng',
      });
    return res.json({
      status: 'OK',
      message: 'Login success',
    });
  }
}

module.exports = new UserController();
