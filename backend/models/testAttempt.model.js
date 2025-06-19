import mongoose from "mongoose";

const testAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  answers: [
    {
      questionId: String,
      selectedOption: String,
      numericalAnswer: Number
    }
  ],
  score: Number,
  totalPoints: Number,
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);
export default TestAttempt;
