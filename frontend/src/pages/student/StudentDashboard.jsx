import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, BookOpen } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { getTestsForStudent, mockTestAttempts } from '../../data/mockData';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [tests, setTests] = useState([]);
  const [testAttempts, setTestAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get available tests and student's test attempts
        const availableTests = getTestsForStudent();
        const studentAttempts = mockTestAttempts.filter(attempt => 
          attempt.studentId === currentUser.id
        );
        
        setTests(availableTests);
        setTestAttempts(studentAttempts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchStudentData();
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (test) => {
    if (test.isAvailable) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Available Now
        </span>
      );
    } else if (test.isUpcoming) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Upcoming
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Closed
        </span>
      );
    }
  };
  
  const hasAttempted = (testId) => {
    return testAttempts.some(attempt => attempt.testId === testId);
  };

  return (
    //changed
    <div className="h-screen w-screen bg-gray-50"> 
      <Navbar title="Student Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.name}</h1>
          <p className="text-gray-600 mt-1">View your upcoming and available tests</p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading tests...</p>
          </div>
        ) : (
          <>
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Available Tests</h2>
              
              {tests.filter(test => test.isAvailable).length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No tests available right now.</p>
                  <p className="text-gray-500 mt-1">Check back later or see upcoming tests below.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests
                    .filter(test => test.isAvailable)
                    .map((test) => (
                      <div key={test.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md test-card">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">{test.title}</h3>
                            {getStatusBadge(test)}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">{test.subject}</p>
                          <p className="text-gray-600 text-sm mb-4">{test.description}</p>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Clock size={16} className="mr-1" />
                            <span>{test.duration} minutes</span>
                          </div>
                          
                          <div className="text-sm text-gray-500 mb-4">
                            <div>Ends: {formatDate(test.endTime)}</div>
                          </div>
                          
                          <div className="pt-2 border-t border-gray-100">
                            {hasAttempted(test.id) ? (
                              <Link
                                to={`/student/results/${test.id}`}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                View Results
                              </Link>
                            ) : (
                              <Link
                                to={`/student/take-test/${test.id}`}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <BookOpen size={16} className="mr-2" />
                                Start Test
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Tests</h2>
              
              {tests.filter(test => test.isUpcoming).length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No upcoming tests scheduled.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests
                    .filter(test => test.isUpcoming)
                    .map((test) => (
                      <div key={test.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md test-card">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">{test.title}</h3>
                            {getStatusBadge(test)}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">{test.subject}</p>
                          <p className="text-gray-600 text-sm mb-4">{test.description}</p>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Clock size={16} className="mr-1" />
                            <span>{test.duration} minutes</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Calendar size={16} className="mr-1" />
                            <span>Starts: {formatDate(test.startTime)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Completed Tests</h2>
              
              {testAttempts.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">You haven't completed any tests yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completed On
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testAttempts.map((attempt) => {
                        const test = tests.find(t => t.id === attempt.testId);
                        return (
                          <tr key={attempt.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{test?.title}</div>
                              <div className="text-sm text-gray-500">{test?.subject}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(attempt.completedAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{attempt.score} / {attempt.totalPoints}</div>
                              <div className="text-sm text-gray-500">
                                {Math.round((attempt.score / attempt.totalPoints) * 100)}%
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link 
                                to={`/student/results/${attempt.testId}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Results
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;