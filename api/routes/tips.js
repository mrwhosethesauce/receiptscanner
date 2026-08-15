const express = require('express');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const requireAuth = require('../middleware/auth');
const { generateTips } = require('../utils/claude');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: { category: '$category', month: { $dateToString: { format: '%Y-%m', date: '$date' } } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': -1 } },
    ]);

    if (summary.length === 0) {
      return res.json({ tips: ['Add a few expenses first so Claude has spending data to analyze.'] });
    }

    const tips = await generateTips(summary);
    res.json({ tips });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate tips', details: err.message });
  }
});

module.exports = router;
