const Transaction = require('../models/Transaction');
const User = require('../models/User');

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate({
      path: 'categoryId',
      select: 'image name',
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};

const addTransaction = async (req, res) => {
  const { userId, date, amount, type, categoryId, description } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Adjust the user's wallet balance based on the type of transaction
    if (type === 'expense') {
      user.wallet -= amount;
    } else if (type === 'income') {
      user.wallet += amount;
    }

    await user.save();

    const newTransaction = new Transaction({
      userId,
      date,
      amount,
      type,
      categoryId,
      description,
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error creating transaction', error });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const user = await User.findById(transaction.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Adjust the user's wallet balance based on the type of transaction
    if (transaction.type === 'expense') {
      user.wallet += transaction.amount;
    } else if (transaction.type === 'income') {
      user.wallet -= transaction.amount;
    }

    await user.save();
    await Transaction.findByIdAndDelete(id);

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
};

module.exports = { getAllTransactions, addTransaction, deleteTransaction };
