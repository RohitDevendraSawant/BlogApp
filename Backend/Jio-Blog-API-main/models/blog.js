const mongoose = require("mongoose");
const { Schema } = mongoose;
const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  authorId: {
    type: String, 
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  popular: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("blogs", BlogSchema);