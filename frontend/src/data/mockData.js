// Mock data for the application
import { USER_ROLES, QUESTION_TYPES, TEST_STATUS } from '../types';

// Mock users
export const mockUsers = [
  {
    id: '1',
    name: 'Teacher Demo',
    email: 'teacher@example.com',
    password: 'password',
    role: USER_ROLES.TEACHER
  },
  {
    id: '2',
    name: 'Student Demo',
    email: 'student@example.com',
    password: 'password',
    role: USER_ROLES.STUDENT
  }
];

// Mock questions
export const mockQuestions = [
  {
    id: 'q1',
    text: 'What is the capital of France?',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'London' },
      { id: 'b', text: 'Berlin' },
      { id: 'c', text: 'Paris' },
      { id: 'd', text: 'Madrid' }
    ],
    correctAnswer: 'c',
    points: 5,
    imageUrl: null
  },
  {
    id: 'q2',
    text: 'What is the value of π (pi) to 2 decimal places?',
    type: QUESTION_TYPES.NUMERICAL,
    correctAnswer: '3.14',
    tolerance: 0.01,
    points: 5,
    imageUrl: null
  },
  {
    id: 'q3',
    text: 'Which of the following is the chemical symbol for gold?',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Au' },
      { id: 'b', text: 'Ag' },
      { id: 'c', text: 'Fe' },
      { id: 'd', text: 'Cu' }
    ],
    correctAnswer: 'a',
    points: 5,
    imageUrl: null
  },
  {
    id: 'q4',
    text: 'Calculate the value of x: 2x + 5 = 15',
    type: QUESTION_TYPES.NUMERICAL,
    correctAnswer: '5',
    tolerance: 0,
    points: 5,
    imageUrl: null
  },
  {
    id: 'q5',
    text: 'Which planet is known as the Red Planet?',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Venus' },
      { id: 'b', text: 'Mars' },
      { id: 'c', text: 'Jupiter' },
      { id: 'd', text: 'Mercury' }
    ],
    correctAnswer: 'b',
    points: 5,
    imageUrl: null
  }
];

// Mock tests
export const mockTests = [
  {
    id: 't1',
    title: 'Science Quiz',
    description: 'Test your knowledge of basic science concepts',
    subject: 'Science',
    duration: 30, // minutes
    totalPoints: 25,
    questions: ['q3', 'q5'],
    createdBy: '1', // teacher id
    startTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    endTime: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
    status: TEST_STATUS.PUBLISHED
  },
  {
    id: 't2',
    title: 'Math Test',
    description: 'Basic mathematics assessment',
    subject: 'Mathematics',
    duration: 45, // minutes
    totalPoints: 15,
    questions: ['q2', 'q4'],
    createdBy: '1', // teacher id
    startTime: new Date(Date.now() - 86400000).toISOString(), // yesterday
    endTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    status: TEST_STATUS.PUBLISHED
  },
  {
    id: 't3',
    title: 'General Knowledge',
    description: 'Test your general knowledge',
    subject: 'General Studies',
    duration: 20, // minutes
    totalPoints: 5,
    questions: ['q1'],
    createdBy: '1', // teacher id
    startTime: new Date(Date.now()).toISOString(), // now
    endTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    status: TEST_STATUS.PUBLISHED
  }
];

// Mock student test attempts
export const mockTestAttempts = [
  {
    id: 'a1',
    testId: 't2',
    studentId: '2',
    startedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    completedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    answers: [
      { questionId: 'q2', answer: '3.14' },
      { questionId: 'q4', answer: '5' }
    ],
    score: 10,
    totalPoints: 10,
    status: 'completed'
  }
];

// Helper function to get questions for a test
export const getQuestionsForTest = (testId) => {
  const test = mockTests.find(t => t.id === testId);
  if (!test) return [];
  
  return test.questions.map(qId => 
    mockQuestions.find(q => q.id === qId)
  ).filter(q => q); // filter out any undefined questions
};

// Helper function to get tests for a student (upcoming and available)
export const getTestsForStudent = () => {
  const now = new Date();
  
  return mockTests
    .filter(test => test.status === TEST_STATUS.PUBLISHED)
    .map(test => ({
      ...test,
      isAvailable: new Date(test.startTime) <= now && new Date(test.endTime) >= now,
      isUpcoming: new Date(test.startTime) > now,
      isPast: new Date(test.endTime) < now
    }));
};

// Helper function to get tests created by a teacher
export const getTestsForTeacher = (teacherId) => {
  return mockTests.filter(test => test.createdBy === teacherId);
};