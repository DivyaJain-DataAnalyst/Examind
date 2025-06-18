import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flag, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { mockTests, getQuestionsForTest } from '../../data/mockData';
import { QUESTION_TYPES } from '../../types';

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find test in mock data
        const testData = mockTests.find(t => t.id === testId);
        
        if (!testData) {
          toast.error('Test not found');
          navigate('/student');
          return;
        }
        
        // Check if test is currently available
        const now = new Date();
        const startTime = new Date(testData.startTime);
        const endTime = new Date(testData.endTime);
        
        if (now < startTime) {
          toast.error('This test is not yet available');
          navigate('/student');
          return;
        }
        
        if (now > endTime) {
          toast.error('This test has ended');
          navigate('/student');
          return;
        }
        
        // Get questions for this test
        const testQuestions = getQuestionsForTest(testId);
        
        if (testQuestions.length === 0) {
          toast.error('No questions found for this test');
          navigate('/student');
          return;
        }
        
        setTest(testData);
        setQuestions(testQuestions);
        
        // Initialize empty answers object
        const initialAnswers = {};
        testQuestions.forEach(q => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
        
        // Set timer
        const timeRemaining = Math.min(
          testData.duration * 60, // Test duration in seconds
          (endTime - now) / 1000 // Time until test ends in seconds
        );
        setTimeLeft(Math.floor(timeRemaining));
        
      } catch (error) {
        console.error('Error fetching test:', error);
        toast.error('Failed to load test');
        navigate('/student');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestData();
  }, [testId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleTimeUp = useCallback(() => {
    toast.error('Time is up! Submitting your test...');
    handleSubmitTest();
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours > 0 ? String(hours).padStart(2, '0') : null,
      String(minutes).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    window.scrollTo(0, 0);
  };

  const toggleFlagQuestion = (index) => {
    setFlaggedQuestions(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const isQuestionAnswered = (questionId) => {
    return answers[questionId] !== '';
  };

  const handleSubmitTest = () => {
    // Calculate score
    let score = 0;
    let totalPoints = 0;
    
    questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      
      if (!userAnswer) return; // Skip unanswered questions
      
      if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
        if (userAnswer === question.correctAnswer) {
          score += question.points;
        }
      } else if (question.type === QUESTION_TYPES.NUMERICAL) {
        const numericAnswer = parseFloat(userAnswer);
        const correctAnswer = parseFloat(question.correctAnswer);
        const tolerance = question.tolerance || 0;
        
        if (!isNaN(numericAnswer) && 
            !isNaN(correctAnswer) && 
            Math.abs(numericAnswer - correctAnswer) <= tolerance) {
          score += question.points;
        }
      }
    });
    
    // In a real app, you would save this data to your backend
    console.log('Test completed:', {
      testId,
      answers,
      score,
      totalPoints
    });
    
    // Navigate to results page
    navigate(`/student/results/${testId}`, { 
      state: { 
        score, 
        totalPoints,
        answers
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar title="Loading Test..." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading test...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    //changed
    <div className="w-screen h-screen bg-gray-50">
      <Navbar title={test?.title || 'Take Test'} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Main content - Question */}
          <div className="lg:w-3/4 bg-white shadow rounded-lg p-6 fade-in">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-xl font-bold text-gray-900">{test?.title}</h1>
              
              <div className="mt-2 sm:mt-0 flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
                <Clock size={18} className="mr-2" />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Question {currentQuestionIndex + 1} of {questions.length}</h2>
                <button
                  onClick={() => toggleFlagQuestion(currentQuestionIndex)}
                  className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                    flaggedQuestions.includes(currentQuestionIndex)
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Flag size={16} className="mr-1" />
                  {flaggedQuestions.includes(currentQuestionIndex) ? 'Flagged' : 'Flag for Review'}
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-800">{currentQuestion.text}</p>
                
                {currentQuestion.imageUrl && (
                  <div className="mt-3">
                    <img 
                      src={currentQuestion.imageUrl} 
                      alt="Question" 
                      className="max-h-64 object-contain bg-white border rounded-md mx-auto"
                    />
                  </div>
                )}
              </div>
              
              {currentQuestion.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <label 
                      key={option.id} 
                      className={`block p-4 border rounded-lg cursor-pointer hover:bg-blue-50 ${
                        answers[currentQuestion.id] === option.id
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name={`question_${currentQuestion.id}`}
                          value={option.id}
                          checked={answers[currentQuestion.id] === option.id}
                          onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <span className="ml-3 text-gray-700">{option.id.toUpperCase()}. {option.text}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              
              {currentQuestion.type === QUESTION_TYPES.NUMERICAL && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Answer
                  </label>
                  <input
                    type="text"
                    value={answers[currentQuestion.id]}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your numerical answer"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Previous
              </button>
              
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>
          
          {/* Sidebar - Question navigation */}
          <div className="lg:w-1/4 bg-white shadow rounded-lg p-6 self-start">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Question Navigator</h2>
            
            <div className="grid grid-cols-5 gap-2 mb-4">
              {questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleGoToQuestion(index)}
                  className={`question-number h-10 w-10 flex items-center justify-center rounded-md text-sm font-medium border 
                    ${currentQuestionIndex === index ? 'active' : ''}
                    ${isQuestionAnswered(question.id) ? 'answered' : ''}
                    ${flaggedQuestions.includes(index) ? 'flagged' : ''}
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-sm bg-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Current Question</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-sm bg-green-600"></div>
                <span className="ml-2 text-sm text-gray-600">Answered</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-sm border-2 border-amber-500"></div>
                <span className="ml-2 text-sm text-gray-600">Flagged for Review</span>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">
                  {Object.values(answers).filter(a => a !== '').length} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{
                    width: `${(Object.values(answers).filter(a => a !== '').length / questions.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
            
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="w-full mt-6 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckCircle size={16} className="mr-2" />
              Submit Test
            </button>
          </div>
        </div>
      </div>
      
      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Submit Test</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to submit your test? You will not be able to make any changes after submission.
                      </p>
                      
                      <div className="mt-4 bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Questions answered:</span> {Object.values(answers).filter(a => a !== '').length} of {questions.length}
                        </p>
                        {flaggedQuestions.length > 0 && (
                          <p className="text-sm text-amber-600 mt-1">
                            <span className="font-medium">Warning:</span> You have {flaggedQuestions.length} flagged question(s) for review.
                          </p>
                        )}
                        {Object.values(answers).filter(a => a === '').length > 0 && (
                          <p className="text-sm text-red-600 mt-1">
                            <span className="font-medium">Warning:</span> You have {Object.values(answers).filter(a => a === '').length} unanswered question(s).
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Submit Test
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmit(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Continue Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeTest;