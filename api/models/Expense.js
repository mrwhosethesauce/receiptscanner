const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
}, { _id: false });

const CATEGORIES = ['Groceries', 'Dining', 'Transport', 'Utilities', 'Shopping', 'Health', 'Entertainment', 'Travel', 'Other'];

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  merchant: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: CATEGORIES, default: 'Other' },
  date: { type: Date, required: true },
  items: { type: [itemSchema], default: [] },
  receiptImageUrl: { type: String },
}, { timestamps: true });

expenseSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
