const router = require('express').Router();
const userController = require('../controllers/UserController');
const { authenticateUser } = require('../middlewares/auth');

router.post('/register/default', userController.registerDefault);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAllUsers);
module.exports = router;
