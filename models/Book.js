const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    page_count: { type: Number, required: true },
    image_url: { type: String, required: true },
    description: { type: String, required: true, unique: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);
