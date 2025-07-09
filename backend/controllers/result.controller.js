// controllers/resultController.js

import TestAttempt from "../models/testAttempt.model.js";
import Test from "../models/test.model.js";
import User from "../models/user.model.js";

export const getTestResultsByTestId = async (req, res) => {
    try {
        const { testId } = req.params;
        console.log(`Backend: Fetching results for testId: ${testId}`);

        const test = await Test.findById(testId);
        if (!test) {
            console.log(`Backend: Test with ID ${testId} not found.`);
            return res.status(404).json({ message: "Test not found" });
        }

        const attempts = await TestAttempt.find({ testId })
            .populate("studentId", "name email")
            .lean();

        console.log(`Backend: Found ${attempts.length} attempts for test ${testId}`);

        const formattedAttempts = attempts.map(attempt => {
            return {
                _id: attempt._id,
                studentId: attempt.studentId,
                score: attempt.score,
                totalPoints: attempt.totalPoints,
                completedAt: attempt.completedAt,
            };
        });

        console.log(`Backend: Sending testTitle: ${test.title}, testSubject: ${test.subject}, attempts count: ${formattedAttempts.length}`);

        res.status(200).json({
            testTitle: test.title,
            testSubject: test.subject, // <--- ADDED THIS LINE
            attempts: formattedAttempts,
        });

    } catch (err) {
        console.error("Backend Error: Error fetching test results:", err);
        res.status(500).json({ message: "Failed to fetch test results" });
    }
};
export const getDetailedStudentResult = async (req, res) => {
    try {
        const { testId, studentId } = req.params;
        console.log(`Backend: getDetailedStudentResult - Fetching result for testId: ${testId}, studentId: ${studentId}`); // NEW LOG

        const attempt = await TestAttempt.findOne({ testId, studentId }).lean();
        if (!attempt) {
            console.log(`Backend: No attempt found for testId: ${testId}, studentId: ${studentId}`); // NEW LOG
            return res.status(404).json({ message: "No attempt found" });
        }

        const test = await Test.findById(testId).lean();
        if (!test) {
            console.log(`Backend: Test not found for testId: ${testId}`); // NEW LOG
            return res.status(404).json({ message: "Test not found" });
        }

        // Fetch student name separately, as TestAttempt doesn't directly populate User by default
        // unless your TestAttempt schema's studentId ref itself has a populate setup.
        // Best to explicitly fetch it if not populated.
        const student = await User.findById(studentId);
        if (!student) {
            console.log(`Backend: Student not found for studentId: ${studentId}`); // NEW LOG
            return res.status(404).json({ message: "Student not found" });
        }


        const detailedQuestions = test.questions.map((q) => {
            const userAnswer = attempt.answers.find(
                (a) => a.questionId === q.id // Assuming q.id is a string or compatible with a.questionId
            );

            let isCorrect = false;
            let actualUserAnswer = null; // Initialize to null for clarity

            if (q.type === "multiple-choice") {
                isCorrect = userAnswer?.selectedOption === q.correctAnswer;
                actualUserAnswer = userAnswer?.selectedOption || null;
            } else if (q.type === "numerical") {
                const tolerance = q.tolerance ?? 0;
                const correct = parseFloat(q.correctAnswer);
                const answered = parseFloat(userAnswer?.numericalAnswer); // Ensure it's parsed as a number
                isCorrect = !isNaN(answered) && Math.abs(correct - answered) <= tolerance;
                actualUserAnswer = !isNaN(answered) ? answered : null; // Store numerical answer
            }

            return {
                questionId: q.id,
                text: q.text,
                imageUrl: q.imageUrl || null,
                type: q.type,
                options: q.options || [], // Ensure options are included for MCQs
                correctAnswer: q.correctAnswer,
                userAnswer: actualUserAnswer, // Pass the actual user's answer (selected option or numerical value)
                isCorrect,
                points: q.points,
            };
        });

        // Ensure test object sent back has 'title' and 'subject'
        res.status(200).json({
            student: { // Ensure student object includes name
                _id: student._id,
                name: student.name,
                email: student.email,
                role: student.role, // Include role if needed
            },
            test: { // Ensure test object has required fields
                _id: test._id,
                title: test.title,
                subject: test.subject,
                description: test.description,
                duration: test.duration,
                startTime: test.startTime,
                endTime: test.endTime,
            },
            detailedQuestions,
            score: attempt.score,
            totalPoints: attempt.totalPoints,
        });
    } catch (err) {
        console.error("Backend Error: Failed to load student result:", err); // NEW LOG
        res.status(500).json({ message: "Failed to fetch student result" });
    }
};