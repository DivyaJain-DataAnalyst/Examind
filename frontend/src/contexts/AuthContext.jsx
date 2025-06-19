// src/contexts/AuthContext.js
import { createContext, useContext, useState } from 'react';
import axios from '../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });
const login = async (email, password) => {
  try {
    const res = await axios.post('/users/login', { email, password });
    const { user, token } = res.data;

    // Save full user including role
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
    setUser(user);
    return true;
  } catch (err) {
    console.error(err.response?.data || err.message);
    return false;
  }
};
  // const login = async (email, password) => {
  //   try {
  //     const res = await axios.post('/users/login', { email, password });
  //     const { user, token } = res.data;

  //     localStorage.setItem('currentUser', JSON.stringify(user));
  //     localStorage.setItem('token', token);
  //     setUser(user);
  //     return true;
  //   } catch (err) {
  //     console.error(err.response?.data || err.message);
  //     return false;
  //   }
  // };

  const register = async (name, email, password, role) => {
    console.log('Registering user:', { name, email, password, role });
    try {
      const res = await axios.post('/users/register', {
        name,
        email,
        password,
        role
      });

      const { user, token } = res.data;
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', token);
      setUser(user);
      return true;
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);






// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const savedUser = localStorage.getItem('currentUser');
//     if (savedUser) {
//       setCurrentUser(JSON.parse(savedUser));
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
//       if (res.data && res.data.user) {
//         setCurrentUser(res.data.user);
//         setIsAuthenticated(true);
//         localStorage.setItem('currentUser', JSON.stringify(res.data.user));
//         return true;
//       }
//       return false;
//     } catch (error) {
//       return false;
//     }
//   };

//   const register = async (name, email, password, role) => {
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
//       if (res.data && res.data.user) {
//         setCurrentUser(res.data.user);
//         setIsAuthenticated(true);
//         localStorage.setItem('currentUser', JSON.stringify(res.data.user));
//         return true;
//       }
//       return false;
//     } catch (error) {
//       return false;
//     }
//   };

//   const logout = () => {
//     setCurrentUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem('currentUser');
//   };

//   return (
//     <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated, register }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);