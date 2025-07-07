// controllers/resultController.js

import TestAttempt from "../models/testAttempt.model.js";
import Test from "../models/test.model.js";
import User from "../models/user.model.js";

export const getTestResultsByTestId = async (req, res) => {
  try {
    const { testId } = req.params;

    const attempts = await TestAttempt.find({ testId })
      .populate("studentId", "name email")
      .lean();

    res.status(200).json({ attempts });
  } catch (err) {
    console.error("Error fetching test results:", err);
    res.status(500).json({ message: "Failed to fetch test results" });
  }
};

export const getDetailedStudentResult = async (req, res) => {
  try {
    const { testId, studentId } = req.params;

    const attempt = await TestAttempt.findOne({ testId, studentId }).lean();
    if (!attempt) return res.status(404).json({ message: "No attempt found" });

    const test = await Test.findById(testId).lean();
    if (!test) return res.status(404).json({ message: "Test not found" });

    const detailedQuestions = test.questions.map((q) => {
      const userAnswer = attempt.answers.find(
        (a) => a.questionId === q.id
      );

      let isCorrect = false;
      if (q.type === "multiple-choice") {
        isCorrect = userAnswer?.selectedOption === q.correctAnswer;
      } else if (q.type === "numerical") {
        const tolerance = q.tolerance ?? 0;
        const correct = parseFloat(q.correctAnswer);
        const answered = parseFloat(userAnswer?.numericalAnswer);
        isCorrect = Math.abs(correct - answered) <= tolerance;
      }

      return {
        questionId: q.id,
        text: q.text,
        imageUrl: q.imageUrl,
        type: q.type,
        correctAnswer: q.correctAnswer,
        userAnswer:
          q.type === "multiple-choice"
            ? userAnswer?.selectedOption
            : userAnswer?.numericalAnswer,
        isCorrect,
        points: q.points,
      };
    });

    res.status(200).json({
      test: {
        _id: test._id,
        title: test.title,
        subject: test.subject,
      },
      detailedQuestions,
      score: attempt.score,
      totalPoints: attempt.totalPoints,
    });
  } catch (err) {
    console.error("Error fetching student result:", err);
    res.status(500).json({ message: "Failed to fetch student result" });
  }
};
