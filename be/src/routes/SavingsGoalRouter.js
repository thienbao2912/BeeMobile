const express = require("express");
const {
  depositToSavingGoal,
  getAllSavingsGoalsByUser,
  updateSavingsGoal,
  addSavingsGoal,
  getSavingGoalById,
  deleteSavingGoal,
  addTransaction,
} = require("../controllers/SavingsGoalController");
const router = express.Router();

router.get("/goals/:userId", getAllSavingsGoalsByUser);

router.post("/goals", addSavingsGoal);

router.get("/goals/detail/:goalId", getSavingGoalById);

router.put("/goals/:goalId", updateSavingsGoal);

router.delete("/goals/:goalId", deleteSavingGoal);
router.post('/goals/transaction', addTransaction);

module.exports = router;
