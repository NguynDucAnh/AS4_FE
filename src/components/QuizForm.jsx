import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const QuizForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector(state => state.auth);
  
  // Kiểm tra quyền Admin
  useEffect(() => {
    if (!user || !user.admin) {
      navigate('/quizzes');
    }
  }, [user, navigate]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: []
  });

  const [availableQuestions, setAvailableQuestions] = useState([]);

  useEffect(() => {
    // Fetch available questions
    fetchAvailableQuestions();
    
    // If editing, fetch the quiz data
    if (id) {
      axios.get(`https://as3-be-auth.onrender.com/api/quizzes/${id}`)
        .then(res => setFormData(res.data))
        .catch(err => console.error("Lỗi lấy dữ liệu", err));
    }
  }, [id]);

  const fetchAvailableQuestions = async () => {
    try {
      const res = await axios.get('https://as3-be-auth.onrender.com/api/questions');
      setAvailableQuestions(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách câu hỏi", err);
    }
  };

  const handleAddQuestion = (questionId) => {
    if (!formData.questions.includes(questionId)) {
      setFormData({
        ...formData,
        questions: [...formData.questions, questionId]
      });
    }
  };

  const handleRemoveQuestion = (questionId) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q !== questionId)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (id) {
        await axios.put(`https://as3-be-auth.onrender.com/api/quizzes/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('https://as3-be-auth.onrender.com/api/quizzes', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/admin/quizzes');
    } catch (err) {
      alert("Lỗi lưu dữ liệu! Kiểm tra quyền của bạn.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Sửa Quiz' : 'Thêm Quiz Mới'}</h2>
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Tiêu đề Quiz:</label>
          <input
            type="text"
            className="form-control"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả:</label>
          <textarea
            className="form-control"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows="3"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Chọn Câu Hỏi:</label>
          <div className="border p-3 mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {availableQuestions.map(question => (
              <div key={question._id} className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`q_${question._id}`}
                  checked={formData.questions.includes(question._id)}
                  onChange={e => {
                    if (e.target.checked) {
                      handleAddQuestion(question._id);
                    } else {
                      handleRemoveQuestion(question._id);
                    }
                  }}
                />
                <label className="form-check-label" htmlFor={`q_${question._id}`}>
                  {question.text}
                </label>
              </div>
            ))}
          </div>
          <p className="text-muted">Đã chọn {formData.questions.length} câu hỏi</p>
        </div>

        <button type="submit" className="btn btn-primary me-2">Lưu lại</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/quizzes')}>
          Hủy
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
