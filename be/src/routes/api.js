const express = require('express');
const { getAllSavingsGoals } = require('../controllers/SavingsGoalController');
const router = express.Router();

// Route để lấy tất cả mục tiêu tiết kiệm
router.get('/goals', getAllSavingsGoals);

module.exports = router;
