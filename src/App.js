import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Login from './components/Login';
import QuizList from './components/QuizList';
import TakeQuiz from './components/TakeQuiz';
import AdminUsers from './components/AdminUsers';
import AdminQuestions from './components/AdminQuestions';
import QuestionForm from './components/QuestionForm';
import AdminQuizzes from './components/AdminQuizzes';
import QuizForm from './components/QuizForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Phía người dùng (Làm bài) */}
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/take-quiz/:id" element={<TakeQuiz />} />
        
        {/* Phía quản trị (CRUD) */}
        <Route path="/admin/users" element={<AdminUsers />} />
        
        <Route path="/admin/questions" element={<AdminQuestions />} />
        <Route path="/admin/questions/create" element={<QuestionForm />} />
        <Route path="/admin/questions/edit/:id" element={<QuestionForm />} />
        
        <Route path="/admin/quizzes" element={<AdminQuizzes />} />
        <Route path="/admin/quizzes/create" element={<QuizForm />} />
        <Route path="/admin/quizzes/edit/:id" element={<QuizForm />} />
      </Routes>
    </Router>
  );
}

export default App;