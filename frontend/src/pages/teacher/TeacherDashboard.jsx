import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, BarChart, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { getTestsForTeacher } from '../../data/mockData';

const TeacherDashboard = () => {
  const { currentUser } = useAuth();
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch tests created by the teacher
    const fetchTests = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const teacherTests = getTestsForTeacher(currentUser.id);
        setTests(teacherTests);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchTests();
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

  return (
    <div className="h-screen w-screen bg-gray-50">
      <Navbar title="Teacher Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.name}</h1>
            <p className="text-gray-600 mt-1">Manage your tests and view student performance</p>
          </div>
          
          <Link
            to="/teacher/create-test"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle size={18} className="mr-2" />
            Create New Test
          </Link>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Tests</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading tests...</p>
            </div>
          ) : tests.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">You haven't created any tests yet.</p>
              <Link
                to="/teacher/create-test"
                className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <PlusCircle size={16} className="mr-1" />
                Create your first test
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <div key={test.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md test-card">
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{test.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{test.subject}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock size={16} className="mr-1" />
                      <span>{test.duration} minutes</span>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      <div>Start: {formatDate(test.startTime)}</div>
                      <div>End: {formatDate(test.endTime)}</div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {test.status}
                      </span>
                      
                      <div className="flex space-x-2">
                        <Link
                          to={`/teacher/edit-test/${test.id}`}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Link>
                        
                        <Link
                          to={`/teacher/results/${test.id}`}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          <BarChart size={14} className="mr-1" />
                          Results
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;