const jwt = require('jsonwebtoken');

function authenticateAdmin(req, res, next) {
  const token = req.headers.token;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user.Quyen < 1) return res.sendStatus(403);
    next();
  });
}
function authenticateUser(req, res, next) {
  const token = req.headers.token;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    const { exp, iat, ...userInfo } = user;
    req.user = userInfo;
    next();
  });
}

module.exports = { authenticateAdmin, authenticateUser };
