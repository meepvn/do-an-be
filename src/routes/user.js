const router = require('express').Router();
const userController = require('../controllers/UserController');
const { authenticateUser } = require('../middlewares/auth');

router.put('/personal', authenticateUser, userController.updatePersonal);
router.get('/personal', authenticateUser, userController.getUserInfo);
router.get('/', userController.getAllUsers);
router.put('/:id', userController.updateById);
router.delete('/:id', userController.deleteById);
router.post('/register/default', userController.registerDefault);
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
