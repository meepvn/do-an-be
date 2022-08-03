const apiRouter = require('./api');

module.exports = function (app) {
  app.get('/', (req, res) => {
    res.json('OK');
  });
  app.use('/api', apiRouter);
};
