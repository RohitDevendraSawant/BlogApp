import mongoose from "mongoose";
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
  date: {
    type: String,
    required: true,
  }
});

export default mongoose.model("blogs", BlogSchema);