const router = require('express').Router();
const { authenticateUser } = require('../middlewares/auth');
const accountController = require('../controllers/AccountController');

router.put('/personal', authenticateUser, accountController.updatePersonal);
router.put('/pwd/:id', accountController.updatePasswordById);
router.put('/:id', accountController.updateById);
router.get('/personal', authenticateUser, accountController.getAccountInfo);
router.get('/', accountController.getAll);

module.exports = router;
