const accountModel = require('../models/Account');

class AccountController {
  async getAll(req, res) {
    const accounts = await accountModel.getAll();
    const accountInfos = accounts.map((account) => {
      const { MatKhau, ...accountInfo } = account;
      return accountInfo;
    });
    if (accounts instanceof Error)
      return res.json({
        status: 'Error',
        message: accounts.message,
      });
    return res.json(accountInfos);
  }

  async getAccountInfo(req, res) {
    const account = await accountModel.getById(req.user.MaNguoiDung);
    const { MatKhau, ...accountInfo } = account;
    return res.json({
      status: 'OK',
      accountInfo,
    });
  }

  async updatePersonal(req, res) {
    if (!req.body.Email && !req.body.MatKhau)
      return res.json({
        status: 'Error',
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    const { Email = null, MatKhau = null } = req.body;
    const result = await accountModel.updatePersonal(
      Email,
      MatKhau,
      req.user.MaNguoiDung
    );
    if (result instanceof Error)
      return res.json({
        status: 'Error',
        message: result.message,
      });
    return res.json({
      status: 'OK',
    });
  }

  async updateById(req, res) {
    if (
      !req.body.TenTaiKhoan ||
      !req.body.Email ||
      (!req.body.Quyen && req.body.Quyen !== 0)
    )
      return res.json({
        status: 'Error',
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    const { TenTaiKhoan, Email, Quyen } = req.body;
    const result = await accountModel.updateById(
      TenTaiKhoan,
      Email,
      Quyen,
      req.params.id
    );
    if (result instanceof Error)
      return res.json({
        status: 'Error',
        message: result.message,
      });
    return res.json({
      status: 'OK',
    });
  }

  async updatePasswordById(req, res) {
    if (!req.body.MatKhau)
      return res.json({
        status: 'Error',
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    const result = await accountModel.updatePasswordById(
      req.body.MatKhau,
      req.params.id
    );
    if (result instanceof Error)
      return res.json({
        status: 'Error',
        message: result.message,
      });
    return res.json({
      status: 'OK',
      message: `Mật khẩu đã được đổi thành ${req.body.MatKhau}`,
    });
  }
}

module.exports = new AccountController();
