const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!email && !mobile) {
    return res.status(400).json({ message: 'Email or Mobile is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const orQuery = [];
    if (email) orQuery.push({ email });
    if (mobile) orQuery.push({ mobile });

    if (orQuery.length > 0) {
      const existingUser = await User.findOne({ $or: orQuery });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, mobile, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { emailOrMobile, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.json({ token, name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
