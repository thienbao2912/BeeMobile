const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavingsFundSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    members: [
        {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        contribution: { type: Number, default: 0 }
        }
    ],
    transactions: [
        {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        note: { type: String },
        date: { type: Date, default: Date.now }
        }
    ] 
}, {
    timestamps: true
});
SavingsFundSchema.virtual('status').get(function () {
    if (this.targetAmount === 0) return 0; // Tránh chia cho 0
    const percentage = (this.currentAmount / this.targetAmount) * 100;
    return Math.round(percentage); // Làm tròn giá trị phần trăm
  });
  
  
  SavingsFundSchema.set('toJSON', { virtuals: true });
  SavingsFundSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('SavingsFund', SavingsFundSchema);