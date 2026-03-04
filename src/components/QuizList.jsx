import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    const fetchQuizzes = async () => {
      try {
        // Gắn token vào header để xác thực với Backend AS3
        const res = await axios.get('https://as3-be-auth.onrender.com/quizzes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuizzes(res.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu", error);
      }
    };
    fetchQuizzes();
  }, [token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Danh sách Quiz</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Đăng xuất</button>
      </div>
      <ul className="list-group">
        {quizzes.map(quiz => (
          <li key={quiz._id} className="list-group-item d-flex justify-content-between align-items-center">
            {quiz.title}
            <button className="btn btn-success btn-sm" onClick={() => navigate(`/take-quiz/${quiz._id}`)}>Làm bài</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default QuizList;