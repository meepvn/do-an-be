const apiRouter = require('./api.js');

const initRouter = (app) => {
  app.get('/', (req, res) => {
    res.status(200).json('OK');
  });
  app.use('/api', apiRouter);
};

module.exports = initRouter;
