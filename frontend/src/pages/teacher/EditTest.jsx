import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Image, ChevronLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { mockTests, mockQuestions } from '../../data/mockData';
import { QUESTION_TYPES } from '../../types';

const EditTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [testDetails, setTestDetails] = useState({
    title: '',
    description: '',
    subject: '',
    duration: 30,
    startTime: '',
    endTime: ''
  });
  
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find test in mock data
        const test = mockTests.find(t => t.id === testId);
        
        if (!test) {
          toast.error('Test not found');
          navigate('/teacher');
          return;
        }
        
        // Format dates for input fields
        const formatDateForInput = (dateString) => {
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
        };
        
        setTestDetails({
          title: test.title,
          description: test.description || '',
          subject: test.subject,
          duration: test.duration,
          startTime: formatDateForInput(test.startTime),
          endTime: formatDateForInput(test.endTime)
        });
        
        // Get questions for this test
        const testQuestions = test.questions.map(qId => 
          mockQuestions.find(q => q.id === qId)
        ).filter(q => q); // filter out any undefined questions
        
        setQuestions(testQuestions);
      } catch (error) {
        console.error('Error fetching test:', error);
        toast.error('Failed to load test');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestDetails();
  }, [testId, navigate]);

  const handleTestDetailsChange = (e) => {
    const { name, value } = e.target;
    setTestDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionId, value) => {
    const updatedQuestions = [...questions];
    const optionIndex = updatedQuestions[questionIndex].options.findIndex(opt => opt.id === optionId);
    
    if (optionIndex !== -1) {
      updatedQuestions[questionIndex].options[optionIndex].text = value;
      setQuestions(updatedQuestions);
    }
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    const newQuestion = {
      id: `new-q-${Date.now()}`,
      text: '',
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      options: [
        { id: 'a', text: '' },
        { id: 'b', text: '' },
        { id: 'c', text: '' },
        { id: 'd', text: '' }
      ],
      correctAnswer: '',
      points: 5,
      imageUrl: null
    };
    
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    } else {
      toast.error('Test must have at least one question');
    }
  };

  const handleImageUpload = (questionIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server and get a URL back
      // For this demo, we'll simulate having a URL for the image
      const fakeImageUrl = URL.createObjectURL(file);
      
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex].imageUrl = fakeImageUrl;
      setQuestions(updatedQuestions);
      
      toast.success('Image uploaded successfully');
    }
  };

  const handleTypeChange = (questionIndex, newType) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].type = newType;
    
    // Reset correct answer when changing question type
    updatedQuestions[questionIndex].correctAnswer = '';
    
    setQuestions(updatedQuestions);
  };

  const validateForm = () => {
    if (!testDetails.title) return 'Test title is required';
    if (!testDetails.subject) return 'Subject is required';
    if (!testDetails.duration) return 'Duration is required';
    if (!testDetails.startTime) return 'Start time is required';
    if (!testDetails.endTime) return 'End time is required';
    
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text) return `Question ${i + 1} text is required`;
      if (q.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
        if (!q.options.every(opt => opt.text)) {
          return `All options for Question ${i + 1} are required`;
        }
        if (!q.correctAnswer) {
          return `Correct answer for Question ${i + 1} is required`;
        }
      } else if (q.type === QUESTION_TYPES.NUMERICAL) {
        if (!q.correctAnswer) {
          return `Correct answer for Question ${i + 1} is required`;
        }
      }
    }
    
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    
    // In a real app, you would save this data to your backend
    console.log('Updated test details:', testDetails);
    console.log('Updated questions:', questions);
    
    toast.success('Test updated successfully!');
    navigate('/teacher');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar title="Edit Test" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading test...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    // changed
    <div className="w-screen h-screen bg-gray-50"> d
      <Navbar title="Edit Test" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/teacher')}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Test: {testDetails.title}</h1>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Test Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={testDetails.title}
                  onChange={handleTestDetailsChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g., Midterm Physics Exam"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject*
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={testDetails.subject}
                  onChange={handleTestDetailsChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g., Physics"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={testDetails.description}
                  onChange={handleTestDetailsChange}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Provide a brief description of the test"
                />
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)*
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={testDetails.duration}
                  onChange={handleTestDetailsChange}
                  min={5}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time*
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={testDetails.startTime}
                  onChange={handleTestDetailsChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time*
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={testDetails.endTime}
                  onChange={handleTestDetailsChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            
            <h2 className="text-lg font-medium text-gray-900 mb-4">Questions</h2>
            
            {questions.map((question, index) => (
              <div key={question.id} className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-700">Question {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="inline-flex items-center px-2 py-1 text-sm font-medium text-red-700 bg-red-100 rounded hover:bg-red-200"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Remove
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text*
                  </label>
                  <textarea
                    value={question.text}
                    onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                    rows={2}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your question here"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Type*
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        checked={question.type === QUESTION_TYPES.MULTIPLE_CHOICE}
                        onChange={() => handleTypeChange(index, QUESTION_TYPES.MULTIPLE_CHOICE)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Multiple Choice</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        checked={question.type === QUESTION_TYPES.NUMERICAL}
                        onChange={() => handleTypeChange(index, QUESTION_TYPES.NUMERICAL)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Numerical</span>
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) => handleQuestionChange(index, 'points', parseInt(e.target.value, 10))}
                    min={1}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image (Optional)
                  </label>
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Image size={16} className="mr-2" />
                      {question.imageUrl ? 'Change Image' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(index, e)}
                      />
                    </label>
                    {question.imageUrl && (
                      <span className="text-xs text-green-600">Image uploaded</span>
                    )}
                  </div>
                  {question.imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={question.imageUrl} 
                        alt="Question" 
                        className="h-32 object-contain bg-white border rounded-md"
                      />
                    </div>
                  )}
                </div>
                
                {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options*
                    </label>
                    
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center mb-2">
                        <label className="inline-flex items-center mr-2">
                          <input
                            type="radio"
                            name={`question_${question.id}_correct`}
                            checked={question.correctAnswer === option.id}
                            onChange={() => handleCorrectAnswerChange(index, option.id)}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                          />
                        </label>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="mr-2 text-sm font-medium w-6">{option.id.toUpperCase()}.</span>
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => handleOptionChange(index, option.id, e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder={`Option ${option.id.toUpperCase()}`}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-1 text-sm text-gray-500">
                      Select the radio button next to the correct answer
                    </div>
                  </div>
                )}
                
                {question.type === QUESTION_TYPES.NUMERICAL && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correct Answer*
                    </label>
                    <input
                      type="text"
                      value={question.correctAnswer}
                      onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="e.g., 3.14"
                      required
                    />
                    
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tolerance (±)
                      </label>
                      <input
                        type="number"
                        value={question.tolerance || 0}
                        onChange={(e) => handleQuestionChange(index, 'tolerance', parseFloat(e.target.value))}
                        step="0.01"
                        min="0"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="e.g., 0.01"
                      />
                      <div className="mt-1 text-sm text-gray-500">
                        Tolerance allows slightly different answers to be marked as correct (e.g., 3.14 ± 0.01)
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <div className="mb-8">
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus size={16} className="mr-2" />
                Add Question
              </button>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/teacher')}
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTest;