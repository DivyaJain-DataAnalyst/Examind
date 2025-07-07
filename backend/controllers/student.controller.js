import Test from '../models/test.model.js';
import TestAttempt from '../models/testAttempt.model.js';

// ✅ GET /api/student/tests
export const getTestsForStudentController = async (req, res) => {
  try {
    const now = new Date();
    const tests = await Test.find().sort({ startTime: 1 });

    const enhancedTests = tests.map(test => {
      const start = new Date(test.startTime);
      const end = new Date(test.endTime);

      return {
        ...test.toObject(),
        isAvailable: now >= start && now <= end,
        isUpcoming: now < start
      };
    });

    res.status(200).json({ tests: enhancedTests });
  } catch (err) {
    console.error('Error fetching tests:', err);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
};

// ✅ GET /api/student/attempts
export const getStudentAttemptsController = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ studentId: req.user._id });
    res.status(200).json({ attempts });
  } catch (err) {
    console.error('Error fetching attempts:', err);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
};

// ✅ GET /api/student/tests/:testId
export const getSingleTestController = async (req, res) => {
  console.log('Fetching single test for student');
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ error: 'Test not found' });

    const now = new Date();
    if (now < new Date(test.startTime)) return res.status(403).json({ error: 'Test not yet started' });
    if (now > new Date(test.endTime)) return res.status(403).json({ error: 'Test has ended' });

    const { questions, ...testInfo } = test.toObject();
    res.status(200).json({ test: testInfo });
  } catch (err) {
    console.error('Error fetching test:', err);
    res.status(500).json({ error: 'Failed to fetch test' });
  }
};

// ✅ FIXED: GET /api/student/questions/:testId
export const getQuestionsForTestController = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ error: 'Test not found' });

    const safeQuestions = test.questions.map(q => {
      const { correctAnswer, _id, ...rest } = q.toObject();
      return { id: _id.toString(), ...rest };
    });

    res.status(200).json({ questions: safeQuestions });
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};



export const submitTestAttemptController = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers } = req.body;
    const studentId = req.user._id;
    console.log('Submitting test attempt for student:', studentId, 'for test:', testId, 'with answers:', answers);
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ error: 'Test not found' });

    let score = 0;
    let totalPoints = 0;
    const answerArray = [];

    for (const question of test.questions) {
      totalPoints += question.points;
      const questionId = question.id.toString();
      const userAnswer = answers[questionId];
      console.log(`Processing question ${questionId} with user answer:`, userAnswer);
      if (userAnswer === undefined || userAnswer === null) continue;

      let isCorrect = false;

      if (question.type === 'multiple-choice') {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === 'numerical') {
        const given = parseFloat(userAnswer);
        const correct = parseFloat(question.correctAnswer);
        const tolerance = question.tolerance || 0;
        isCorrect = !isNaN(given) && Math.abs(given - correct) <= tolerance;
      }

      if (isCorrect) score += question.points;

      answerArray.push({
        questionId,
        selectedOption:
          question.type === 'multiple-choice' ? userAnswer : undefined,
        numericalAnswer:
          question.type === 'numerical' ? parseFloat(userAnswer) : undefined,
      });
    }

    const attempt = new TestAttempt({
      testId,
      studentId,
      answers: answerArray,
      score,
      totalPoints,
    });

    await attempt.save();

    res.status(201).json({
      message: 'Test submitted successfully',
      score,
      totalPoints,
    });
  } catch (err) {
    console.error('Error submitting test:', err);
    res.status(500).json({ error: 'Failed to submit test' });
  }
};

// Controller: Get Test Results
export const getTestResultController = async (req, res) => {
  try {
    const { testId } = req.params;
    const studentId = req.user._id;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ error: 'Test not found' });

    const attempt = await TestAttempt.findOne({ testId, studentId });
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

    const detailedQuestions = test.questions.map((q) => {
      const userAns = attempt.answers.find(
        (ans) => ans.questionId === q.id.toString()
      );

      const userAnswer =
        q.type === 'multiple-choice'
          ? userAns?.selectedOption ?? null
          : typeof userAns?.numericalAnswer === 'number'
            ? userAns.numericalAnswer
            : null;

      const isCorrect =
        q.type === 'multiple-choice'
          ? q.correctAnswer === userAns?.selectedOption
          : typeof userAns?.numericalAnswer === 'number' &&
            Math.abs(parseFloat(q.correctAnswer) - userAns.numericalAnswer) <=
              (q.tolerance || 0);

      return {
        questionId: q.id,
        text: q.text,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer,
        isCorrect,
        points: q.points,
        imageUrl: q.imageUrl || null,
      };
    });

    res.status(200).json({
      test: {
        title: test.title,
        subject: test.subject,
        description: test.description,
        duration: test.duration,
      },
      score: attempt.score,
      totalPoints: attempt.totalPoints,
      detailedQuestions,
    });
  } catch (err) {
    console.error('Error fetching result:', err);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
};
