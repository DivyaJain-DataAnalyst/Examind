# 📝 Online Test Taking App

An end-to-end MERN stack web application for teachers to create tests and for students to attempt them with live timer, auto-evaluation, and intuitive UI.

## 🌐 Live Demo

Coming soon...

## 🚀 Features

### 👨‍🏫 Teacher Panel
- Create/edit/delete tests
- Add multiple-choice and numerical questions
- Set test timings and duration

### 👨‍🎓 Student Panel
- View available and upcoming tests
- Attempt tests with a live countdown timer
- Navigate through questions using a sidebar
- Auto-submit on timeout
- Instant result calculation

### 🔒 Auth
- Role-based login for Teacher and Student
- Token-based authentication using JWT

## 🧱 Tech Stack

| Tech         | Description                            |
|--------------|----------------------------------------|
| **Frontend** | React, TailwindCSS, React Router, Axios |
| **Backend**  | Node.js, Express.js, MongoDB, Mongoose |
| **Auth**     | JWT, bcrypt                            |

## 📂 Folder Structure (Client & Server)

```bash
├── client/
│   ├── pages/
│   ├── components/
│   └── config/axios.js
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
