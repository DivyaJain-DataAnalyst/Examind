
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill all fields');
      return;
    }
    setIsLoading(true);
    const success = await register(name, email, password, role);
    setIsLoading(false);
    if (success) {
      toast.success('Account created! You are now logged in.');
      navigate(`/${role}`);
    } else {
      toast.error('Registration failed');
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 fade-in">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create an Account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block w-full rounded-md border-gray-300 px-3 py-3 mb-2"
                required
              />
              <input
                type="password"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 px-3 py-3 mb-2"
                required
              />
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="block w-full rounded-md border-gray-300 px-3 py-3"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div className="text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default Register;