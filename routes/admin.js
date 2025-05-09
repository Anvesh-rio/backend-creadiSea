const express = require('express');
const Admin = require('../models/Admin');
const Loan = require('../models/Loan');
const router = express.Router();



router.post('/login', async (req, res) => {
  try {
    const { gmail, password } = req.body;
    const admin = await Admin.findOne({ gmail, password });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Gmail or Password',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        gmail: admin.gmail,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



router.get('/getLoansByUser', async (req, res) => {
  try {
    

    const loans = await Loan.find();

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



router.put("/updateLoanStatus/:id", async (req, res) => {
  const loanId = req.params.id;
  const { status } = req.body;

  // Validate status
  const allowedStatuses = ["pending", "rejected", "verified", "approved"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }

  try {
    const updatedLoan = await Loan.findByIdAndUpdate(
      loanId,
      { status },
      { new: true } // returns updated document
    );

    if (!updatedLoan) {
      return res.status(404).json({ success: false, message: "Loan not found" });
    }

    res.status(200).json({ success: true, message: "Loan status updated", data: updatedLoan });
  } catch (error) {
    console.error("Error updating loan status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
