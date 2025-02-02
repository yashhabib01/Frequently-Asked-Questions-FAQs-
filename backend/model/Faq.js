const mongoose = require("mongoose");
const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translations: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQ", FaqSchema);
