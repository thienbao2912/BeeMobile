const express = require('express');
const TransactionController = require('../controllers/TransactionController');
const middlewareController = require('../middleware/auth');
const router = express.Router();

router.get('', TransactionController.getAllTransactions)
router.get('/:id', TransactionController.getById)
router.post('/', TransactionController.addTransaction)
router.patch('/:id', TransactionController.edit)
router.delete('/:id',TransactionController.deleteTransaction)

module.exports = router;