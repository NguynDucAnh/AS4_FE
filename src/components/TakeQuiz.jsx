import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TakeQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const { token } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu chưa có token thì đẩy về trang đăng nhập
    if (!token) {
      navigate('/');
      return;
    }
    
    // Gọi API lấy chi tiết bài thi
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`https://as3-be-auth.onrender.com/api/quizzes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuiz(res.data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu bài thi", err);
      }
    };
    fetchQuiz();
  }, [id, token, navigate]);

  // Lưu đáp án người dùng chọn
  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  // Tính điểm khi nộp bài
  const handleSubmit = () => {
    let currentScore = 0;
    quiz.questions.forEach(q => {
      if (answers[q._id] === q.correctAnswerIndex) {
        currentScore += 1;
      }
    });
    setScore(currentScore);
  };

  if (!quiz) return <div className="container mt-5">Đang tải dữ liệu...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-primary">{quiz.title}</h2>
      <p className="text-muted">{quiz.description}</p>
      
      {quiz.questions && quiz.questions.length > 0 ? (
        quiz.questions.map((q, index) => (
          <div key={q._id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Câu {index + 1}: {q.text}</h5>
              <div className="mt-3">
                {q.options.map((opt, i) => (
                  <div key={i} className="form-check mb-2">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name={`question_${q._id}`} 
                      id={`opt_${q._id}_${i}`}
                      onChange={() => handleOptionChange(q._id, i)}
                      disabled={score !== null} // Khóa ô chọn sau khi đã nộp bài
                    />
                    <label className="form-check-label" htmlFor={`opt_${q._id}_${i}`}>
                      {opt}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-warning">Bài thi này hiện chưa có câu hỏi nào!</div>
      )}

      {/* Nút nộp bài hoặc Hiện kết quả */}
      {score === null ? (
        <button className="btn btn-success btn-lg mb-5" onClick={handleSubmit}>
          Nộp bài
        </button>
      ) : (
        <div className="alert alert-info mt-4 mb-5">
          <h4 className="alert-heading">Kết quả của bạn:</h4>
          <p className="fs-4"><strong>{score}</strong> / {quiz.questions.length} câu đúng</p>
          <button className="btn btn-secondary mt-2" onClick={() => navigate('/quizzes')}>
            Quay lại danh sách
          </button>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;