const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    totalExpenses: {
        type: Number,
        default: 0
    },
    remainingBudget: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    statusBudget: {
        type: Number,
        enum: [0, 1, 2], // 0: Còn tiền, 1: Hết tiền, 2: Vượt số tiền
        default: 0 // Mặc định là còn tiền
    }
}, { timestamps: true });

module.exports = mongoose.model('budgets', BudgetSchema);