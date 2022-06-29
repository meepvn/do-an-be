const router = require('express').Router();
const instockController = require('../controllers/InstockController.js');

router.put('/:id', instockController.updateInstock);
router.delete('/:id', instockController.deleteInstock);
router.post('/', instockController.insertInstock);
router.get('/', instockController.getAllInstock);
module.exports = router;
