const SavingsGoal = require('../models/SavingGoal');

const getAllSavingsGoalsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const goals = await SavingsGoal.find({ userId });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saving goals', error });
  }
};

const addSavingsGoal = async (req, res) => {
  const { userId, name, targetAmount, currentAmount, startDate, endDate, categoryId } = req.body;

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

module.exports = { getAllSavingsGoalsByUser, addSavingsGoal, getSavingGoalById, updateSavingsGoal };
