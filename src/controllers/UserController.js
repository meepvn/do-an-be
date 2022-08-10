const userModel = require('../models/User');
const accountModel = require('../models/Account');
const bcrypt = require('bcryptjs');

const { generateToken } = require('../ulti/index');

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
      message: 'Register successed',
      result: insertAccountResult,
    });
  }

  async registerDefault(req, res) {
    if (!req.body.Email || !req.body.HoTen || !req.body.SDT || !req.body.DiaChi)
      return res.json({
        status: 'Error',
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    const { HoTen, SDT, DiaChi, Email } = req.body;
    const isPhoneNumberExist = await userModel.findUserByPhoneNumber(SDT);
    if (isPhoneNumberExist > 0 || isPhoneNumberExist instanceof Error) {
      return res.json({
        status: 'Error',
        message: isPhoneNumberExist?.message ?? 'Số điện thoại đã tồn tại',
      });
    }
    const isEmailExist = await accountModel.findByEmail(Email);
    if (isEmailExist > 0 || isEmailExist instanceof Error) {
      return res.json({
        status: 'Error',
        message: isEmailExist?.message ?? 'Email đã tồn tại',
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
      `user${insertId}`,
      '123456',
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
      message: 'Register successed',
      user: {
        username: `user${insertId}`,
        password: '123456',
      },
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
    const { MatKhau: matKhau, ...accountInfo } = matchedAccount;
    const { HoTen } = await userModel.getUserById(accountInfo.MaNguoiDung);
    const userInfo = { HoTen, ...accountInfo };
    const token = generateToken(userInfo);
    return res.json({
      status: 'OK',
      message: 'Login success',
      info: userInfo,
      token,
    });
  }
  async getUserInfo(req, res) {
    const user = await userModel.getUserById(req?.user?.MaNguoiDung);
    return res.json({
      status: 'OK',
      user,
    });
  }
  async deleteById(req, res) {
    const { id } = req.params;
    const accountResult = await accountModel.deleteById(id);
    const userResult = await userModel.deleteById(id);
    console.log(userResult);
    console.log(accountResult);
    return res.json({
      status: 'OK',
    });
  }

  async updateById(req, res) {
    const { HoTen, SDT, DiaChi } = req.body;
    const updateResult = await userModel.updateById(
      HoTen,
      SDT,
      DiaChi,
      req.params.id
    );
    if (updateResult instanceof Error)
      return res.json({
        status: 'Error',
        message: updateResult.message,
      });
    return res.json({
      status: 'OK',
    });
  }
}

module.exports = new UserController();
