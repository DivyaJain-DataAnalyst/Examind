import express from "express";
import {
  getTestResultsByTestId,
  getDetailedStudentResult,
} from "../controllers/result.controller.js";

const router = express.Router();

router.get("/test/:testId", getTestResultsByTestId); // Teacher: all students' attempts
router.get("/test/:testId/student/:studentId", getDetailedStudentResult); // Detailed student result

export default router;
