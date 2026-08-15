require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const receiptRoutes = require('./routes/receipts');
const tipRoutes = require('./routes/tips');

const app = express();

app.set('trust proxy', true);
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/tips', tipRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

module.exports = app;
