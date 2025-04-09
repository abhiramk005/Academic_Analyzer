const mongoose = require("mongoose");

const creditResultSchema = new mongoose.Schema({
  register_number: {
    type: String,
    required: true,
    unique: true, // Each student has only one cumulative credit record
    uppercase: true,
    trim: true,
  },
  batch: {
    type: Number,
    required: true,
  },
  cumulativeCredits: {
    type: Number,
    required: true,
  },
});

const CreditResult = mongoose.model("CreditResult", creditResultSchema);

module.exports = CreditResult;
