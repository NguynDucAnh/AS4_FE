import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const QuestionForm = () => {
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
    text: '', options: '', correctAnswerIndex: 0, author: user?._id
  });

  useEffect(() => {
    if (id) {
      axios.get(`https://as3-be-auth.onrender.com/questions/${id}`)
        .then(res => setFormData({
          ...res.data,
          options: res.data.options.join(', ') // Chuyển mảng thành chuỗi để hiện lên input
        }));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      options: formData.options.split(',').map(o => o.trim()), // Cắt chuỗi thành mảng
      author: user?._id
    };

    try {
      if (id) {
        await axios.put(`https://as3-be-auth.onrender.com/questions/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('https://as3-be-auth.onrender.com/questions', payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      navigate('/admin/questions');
    } catch (err) {
      alert("Lỗi lưu dữ liệu! Kiểm tra quyền của bạn.");
    }
  };

  return (
    <div className="container">
      <h2>{id ? 'Sửa Câu Hỏi' : 'Thêm Câu Hỏi'}</h2>
      <form onSubmit={handleSubmit} className="card p-4">
        <label>Câu hỏi:</label>
        <input type="text" className="form-control mb-2" value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} required />
        
        <label>Các lựa chọn (Cách nhau bằng dấu phẩy):</label>
        <input type="text" className="form-control mb-2" value={formData.options} onChange={e => setFormData({...formData, options: e.target.value})} required />
        
        <label>Vị trí đáp án đúng (Bắt đầu từ 0):</label>
        <input type="number" className="form-control mb-3" value={formData.correctAnswerIndex} onChange={e => setFormData({...formData, correctAnswerIndex: e.target.value})} required />
        
        <button type="submit" className="btn btn-primary">Lưu lại</button>
      </form>
    </div>
  );
};
export default QuestionForm;