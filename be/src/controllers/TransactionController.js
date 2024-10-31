const Transaction = require('../models/Transaction');
const Budget = require("../models/Budget");
const User = require('../models/User');
class TransactionController {
static async getAllTransactions(req, res)  {
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

static async addTransaction (req, res) {
  const { userId, date, amount, type, categoryId, description } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

     // Điều chỉnh số dư ví 
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
    await TransactionController.updateBudget(userId, categoryId, date);
    res.status(200).json(savedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error creating transaction', error });
  }
};


static async getById(req, res) {
  const { userId } = req.query; // Lấy userId từ query params
  const { id } = req.params;

  try {
    const transaction = await Transaction.findOne({ userId, _id: id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ data: transaction });
  } catch (error) {
    console.error("Lỗi khi tìm giao dịch:", error);
    res.status(500).json({ message: 'Server error' });
  }
}


static async edit(req, res) {
  const { userId, date, amount, type, categoryId, description } = req.body;
  const { id } = req.params;

  try {
    // Kiểm tra các trường bắt buộc
    if (!date || !amount || !type || !categoryId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const oldTransaction = await Transaction.findById(id);
    if (!oldTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldAmount = Number(oldTransaction.amount);
    const newAmount = Number(amount);

    // Cập nhật số dư ví
    if (oldTransaction.type === 'expense') {
      user.wallet += oldAmount;
    } else if (oldTransaction.type === 'income') {
      user.wallet -= oldAmount;
    }

    if (type === 'expense') {
      user.wallet -= newAmount;
    } else if (type === 'income') {
      user.wallet += newAmount;
    }

    await user.save();

    const updatedTransaction = await Transaction.findByIdAndUpdate(id, {
      userId, date, amount, type, categoryId, description,
    }, { new: true });

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await TransactionController.updateBudget(userId, categoryId, date); // Cập nhật ngân sách

    res.status(200).json({
      message: 'Updated successfully',
      data: updatedTransaction,
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


static async deleteTransaction(req, res) {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const transaction = await Transaction.findById(id);
    console.log("Transaction fetched:", transaction);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const user = await User.findById(transaction.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (transaction.type === 'expense') {
      user.wallet += transaction.amount;
    } else if (transaction.type === 'income') {
      user.wallet -= transaction.amount;
    }

    await user.save();
    await Transaction.findByIdAndDelete(id);
    console.log('Transaction deleted successfully');
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
};

static async updateBudget(userId, categoryId, transactionDate) {
  try {
    // Tìm ngân sách liên quan tới giao dịch
    const budgets = await Budget.find({
      userId,
      categoryId,
      startDate: { $lte: new Date(transactionDate) },
      endDate: { $gte: new Date(transactionDate) },
    });

    for (let budget of budgets) {
      // Tính toán lại tổng chi tiêu và ngân sách còn lại
      const expenses = await Transaction.find({
        categoryId,
        type: "expense",
        userId,
        date: {
          $gte: new Date(budget.startDate),
          $lte: new Date(budget.endDate),
        },
      });

      const totalExpenses = expenses.reduce((total, transaction) => {
        return total + parseFloat(transaction.amount);
      }, 0);

      budget.totalExpenses = totalExpenses;
      budget.remainingBudget = budget.amount - totalExpenses;
      await budget.save();
    }
  } catch (error) {
    console.error("Error updating budget:", error);
  }
}
}
module.exports = TransactionController;
