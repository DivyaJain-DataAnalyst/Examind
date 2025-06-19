import Test from '../models/test.model.js';
import { validationResult } from 'express-validator';


export const getTeacherTestsController = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const tests = await Test.find({ teacherId });
    res.status(200).json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Error fetching tests' });
  }
};

// POST /api/teacher/tests
export const createTestController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    title,
    description,
    subject,
    duration,
    startTime,
    endTime,
    questions
  } = req.body;
  console.log("Creating test with data:", req.body);
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: 'At least one question is required' });
  }

  try {
    const newTest = new Test({
      teacherId: req.user._id, // from auth middleware
      title,
      description,
      subject,
      duration,
      startTime,
      endTime,
      questions,
      status: 'Upcoming'
    });

    await newTest.save();
    res.status(201).json({ message: 'Test created successfully', test: newTest });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ message: 'Server error while creating test' });
  }
};
