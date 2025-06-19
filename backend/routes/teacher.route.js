import { Router } from 'express';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';
import * as teacherController from '../controllers/teacher.controller.js';

const router = Router();

// GET /api/teacher/tests?teacherId=123
router.get('/tests', authMiddleware.authUser, teacherController.getTeacherTestsController);

// POST /api/teacher/tests
router.post(
  '/tests',
  authMiddleware.authUser,
  body('title').notEmpty().withMessage('Title is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  teacherController.createTestController
);

export default router;
// This code defines the routes for teacher-related operations, such as fetching tests and creating new tests.