const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Loan Schema
const loanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'rejected', 'verified', 'approved'],
    default: 'pending'
  },
  loanTenure: {
    type: Number, // in months
    default: 0
  },
  reasonForLoan: {
    type: String,
    required: true
  },
    fullName: {
    type: String,
    // required: true
  },
  address: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Loan', loanSchema);
