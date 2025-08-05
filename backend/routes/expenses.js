const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// POST /expenses/upload
router.post('/upload', async (req, res) => {
  const { amount, category, description, date } = req.body;

  try {
    const expense = new Expense({
      userId: req.user.id,
      amount,
      category,
      description,
      date: date || new Date()
    });
    await expense.save();
    res.status(201).json({ message: 'Expense uploaded', expense });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// GET /expenses/history
router.get('/history', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

// GET /expenses/trends
router.get('/trends', async (req, res) => {
  try {
    const trends = await Expense.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            category: '$category'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: '$_id.month',
          categories: {
            $push: {
              category: '$_id.category',
              total: '$total'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trends' });
  }
});

// Update
router.put('/:id', async (req, res) => {
  const { amount, category, description } = req.body;
  try {
    await Expense.findByIdAndUpdate(req.params.id, { amount, category, description });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});


module.exports = router;
