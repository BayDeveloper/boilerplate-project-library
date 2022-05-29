const mongoose = require("mongoose");

const LibrarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a book title."],
      maxlength: 50
    },
    comments: [
      {
        type: String,
        maxlength: 100
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Library", LibrarySchema);
