import mongoose from "mongoose";



const optionSchema = new mongoose.Schema({
  id: String,
  text: String,
});

const questionSchema = new mongoose.Schema({
  id: String,
  text: String,
  type: {
    type: String,
    enum: ['multiple-choice', 'numerical'],
    required: true
  },
  options: [optionSchema],
  correctAnswer: String,
  points: Number,
  imageUrl: String,
  tolerance: Number // Only for numerical type
});

const testSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  description: String,
  subject: String,
  duration: Number,
  startTime: Date,
  endTime: Date,
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed'],
    default: 'Upcoming'
  },
  questions: [questionSchema]
});

const Test=mongoose.model('Test', testSchema);
export default Test;
