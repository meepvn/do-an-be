const router = require('express').Router();
const instockController = require('../controllers/InstockController.js');

router.get('/',instockController.getAllInstock);

module.exports = router;
