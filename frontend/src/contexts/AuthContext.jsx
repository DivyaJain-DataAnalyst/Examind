// src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Restore user from token on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // decoded contains _id, name, email, role
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        setUser(null);
      }
    }
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    try {
      const res = await axios.post('/users/login', { email, password });
      const { token } = res.data;
      const decoded = jwtDecode(token);

      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(user)); // ✅ required for Login.jsx
      setUser(decoded);
      return true;
    } catch (err) {
      console.error(err.response?.data || err.message);
      return false;
    }
  };

  // ✅ Register
  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post('/users/register', {
        name,
        email,
        password,
        role
      });

      const { token } = res.data;
      const decoded = jwtDecode(token);

      localStorage.setItem('token', token);
      setUser(decoded);
      return true;
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      return false;
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser'); // optional
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


// // src/contexts/AuthContext.js
// import { createContext, useContext, useState } from 'react';
// import axios from '../config/axios';



// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
 

//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem('currentUser');
//     return stored ? JSON.parse(stored) : null;
//   });
// const login = async (email, password) => {
//   try {
//     const res = await axios.post('/users/login', { email, password });
//     const { user, token } = res.data;

//     // Save full user including role
//     localStorage.setItem('currentUser', JSON.stringify(user));
//     localStorage.setItem('token', token);
//     setUser(user);
//     return true;
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     return false;
//   }
// };


//   const register = async (name, email, password, role) => {
//     console.log('Registering user:', { name, email, password, role });
//     try {
//       const res = await axios.post('/users/register', {
//         name,
//         email,
//         password,
//         role
//       });

//       const { user, token } = res.data;
//       localStorage.setItem('currentUser', JSON.stringify(user));
//       localStorage.setItem('token', token);
//       setUser(user);
//       return true;
//     } catch (err) {
//       console.error('Registration failed:', err.response?.data || err.message);
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('currentUser');
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);






