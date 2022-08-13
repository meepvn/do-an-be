const router = require('express').Router();
const userController = require('../controllers/UserController');
const { authenticateUser } = require('../middlewares/auth');

router.put('/:id', userController.updateById);
router.get('/personal', authenticateUser, userController.getUserInfo);
router.put('/personal', authenticateUser, userController.updatePersonal);
router.delete('/:id', userController.deleteById);
router.post('/register/default', userController.registerDefault);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAllUsers);

module.exports = router;
