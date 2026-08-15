const express = require('express');
const Expense = require('../models/Expense');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
  res.json(expenses);
});

router.post('/', async (req, res) => {
  try {
    const { merchant, amount, category, date, items, receiptImageUrl } = req.body;
    if (!merchant || amount == null || !date) {
      return res.status(400).json({ error: 'merchant, amount and date are required' });
    }

    const expense = await Expense.create({
      userId: req.userId,
      merchant,
      amount,
      category,
      date,
      items,
      receiptImageUrl,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create expense', details: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update expense', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const result = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!result) return res.status(404).json({ error: 'Expense not found' });
  res.status(204).end();
});

module.exports = router;
