const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Loan = require('../models/Loan');
const Admin = require('../models/Admin');


router.post('/register', async (req, res) => {
  try {
    const { name, gmail, password } = req.body;

    const existingUser = await User.findOne({ gmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const newUser = new User({
      name,
      gmail,
      password,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
});



router.post('/login', async (req, res) => {
  try {
    const { gmail, password } = req.body;

    const user = await User.findOne({ gmail, password }); // Find a single user

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Gmail or Password',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        gmail: user.gmail,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



router.post('/requestLoan', async (req, res) => {
  try {
    const {
      userId,
      amount,
      loanTenure,
      reasonForLoan,
      address,
      fullName
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const newLoan = new Loan({
      user: user._id,
      amount,
      loanTenure,
      reasonForLoan,
      address,
      fullName
    });

    const newLoanDone = await newLoan.save();
    return res.status(201).json({ 
      success: true, 
      data: newLoanDone 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});




router.post('/getLoansByUser', async (req, res) => {
  try {
    const { userId, searchTerm } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const loans = await Loan.find({user: userId});

    if (!loans || loans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No loans found for this user',
      });
    }

    return res.status(200).json({
      success: true,
      data: loans,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
});




router.post('/searchLoansByName', async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ success: false, message: 'userId and name are required' });
    }

    const loans = await Loan.find({
      userId,
      fullName: { $regex: name, $options: 'i' }
    });

    return res.json({ success: true, data: loans });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
