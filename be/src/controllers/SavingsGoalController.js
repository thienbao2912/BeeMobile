const SavingsGoal = require('../models/SavingGoal');
const User = require('../models/User');
const getAllSavingsGoalsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const goals = await SavingsGoal.find({ userId })
    .populate('categoryId');
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saving goals', error });
  }
};

 
const addSavingsGoal = async (req, res) => {
  const { userId, name, targetAmount, currentAmount, startDate, endDate, categoryId } = req.body;
  const user = await User.findById(userId);
  if (!user || user.wallet < currentAmount) {
      return res.status(400).json({
          message: 'Số dư trong ví không đủ để thực hiện giao dịch'
      });
  }

  // Trừ tiền từ ví của người dùng
  user.wallet -= currentAmount;
  await user.save();

  try {
    const newGoal = new SavingsGoal({
      userId,
      name,
      targetAmount,
      currentAmount,
      startDate,
      endDate,
      categoryId,
    });
    if (currentAmount > 0) {
      data.transactionHistory = [{ amount: currentAmount, date: new Date() }];
  }
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error saving the goal', error });
  }
};

const getSavingGoalById = async (req, res) => {
  const { goalId } = req.params;

  try {
    const goal = await SavingsGoal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ message: 'Saving goal not found' });
    }
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saving goal', error });
  }
};
const updateSavingsGoal = async (req, res) => {
  const { goalId } = req.params;
  const { name, targetAmount, currentAmount, startDate, endDate, categoryId } = req.body;

  try {
    const updatedGoal = await SavingsGoal.findByIdAndUpdate(
      goalId,
      { name, targetAmount, currentAmount, startDate, endDate, categoryId },
      { new: true }
    );
    
    if (!updatedGoal) {
      return res.status(404).json({ message: 'Saving goal not found' });
    }
    
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating the goal', error });
  }
};
const deleteSavingGoal = async (req, res) => {
  const { goalId } = req.params;

  try {
    const deletedGoal = await SavingsGoal.findByIdAndDelete(goalId);

    if (!deletedGoal) {
      return res.status(404).json({ message: 'Saving goal not found' });
    }

    res.status(200).json({ message: 'Saving goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting the goal', error });
  }
};
const addTransaction = async (req, res) => {
  const { goalId, userId, amount, note, date } = req.body;

  try {
    const goal = await SavingsGoal.findById(goalId);

    if (!goal) {
return res.status(404).json({ message: 'Saving goal not found' });
    }
    const user = await User.findById(userId);
    if (user.wallet < amount) { 
      return res.status(400).json({ message: 'Số dư ví của bạn không đủ để thực hiện giao dịch này.' });
  }

    user.wallet -= amount;
    await user.save();
    const updatedAmount = goal.currentAmount + parseFloat(amount);

    goal.currentAmount = updatedAmount;
    goal.transactionHistory = [
      ...goal.transactionHistory,
      { userId, amount, note, date },
    ];

    await goal.save();

    res.status(200).json({
      message: 'Transaction added successfully',
      updatedAmount,
      transaction: { userId, amount, note, date },
    });
  } catch (error) {res.status(500).json({ message: 'Error adding transaction', error });
}
};
module.exports = {addTransaction, getAllSavingsGoalsByUser, addSavingsGoal, getSavingGoalById, updateSavingsGoal, deleteSavingGoal };