const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    books: { type: Array, required: true },
    image_url: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Author", AuthorSchema);
