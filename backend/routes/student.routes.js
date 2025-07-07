
import express from 'express';
import {
  getTestsForStudentController,
  getStudentAttemptsController,
  getSingleTestController,
  getQuestionsForTestController,
  submitTestAttemptController,
  getTestResultController
} from '../controllers/student.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/tests', authUser, getTestsForStudentController);
router.get('/attempts', authUser, getStudentAttemptsController);
router.get('/tests/:testId', authUser, getSingleTestController);
router.get('/questions/:testId', authUser, getQuestionsForTestController);
router.post('/submit/:testId', authUser, submitTestAttemptController);
router.get('/results/:testId', authUser, getTestResultController);


export default router;

