const express = require('express');
const { getAllSavingsGoalsByUser, updateSavingsGoal , addSavingsGoal, getSavingGoalById } = require('../controllers/SavingsGoalController');
const router = express.Router();

router.get('/goals/:userId', getAllSavingsGoalsByUser);

router.post('/goals', addSavingsGoal);

router.get('/goals/detail/:goalId', getSavingGoalById);

router.put('/goals/:goalId', updateSavingsGoal);

module.exports = router;
