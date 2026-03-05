import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const { user, token } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra quyền Admin
    if (!user || !user.admin) {
      navigate('/quizzes');
      return;
    }
    fetchQuestions();
  }, [user, navigate]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('https://as3-be-auth.onrender.com/api/questions');
      setQuestions(res.data || []);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu", err);
      setQuestions([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
      try {
        await axios.delete(`https://as3-be-auth.onrender.com/api/questions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchQuestions(); // Load lại danh sách
      } catch (err) {
        alert("Bạn không có quyền xóa câu hỏi này!");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Quản lý Câu hỏi</h2>
        <Link to="/admin/questions/create" className="btn btn-success">Thêm Câu Hỏi</Link>
      </div>
      <div className="row">
        {questions.map(q => {
          // Kiểm tra quyền: Là admin HOẶC là tác giả của câu hỏi
          const canEdit = user && (user.admin || user._id === q.author);
          
          return (
            <div key={q._id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">{q.text}</h5>
                  
                  <div className="mb-3">
                    <strong className="text-muted">Các lựa chọn:</strong>
                    <ol className="mb-0 mt-2">
                      {q.options?.map((opt, i) => (
                        <li key={i} className={i === q.correctAnswerIndex ? 'text-success fw-bold' : ''}>
                          {opt}
                          {i === q.correctAnswerIndex && <span className="badge bg-success ms-2">Đúng</span>}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* <small className="text-muted d-block">
                    <strong>Tác giả:</strong> {q. || 'N/A'}
                  </small> */}
                  
                  {canEdit && (
                    <div className="mt-3 d-flex gap-2">
                      <Link 
                        to={`/admin/questions/edit/${q._id}`} 
                        className="btn btn-warning btn-sm flex-grow-1"
                      >
                        Sửa
                      </Link>
                      <button 
                        onClick={() => handleDelete(q._id)} 
                        className="btn btn-danger btn-sm flex-grow-1"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {questions.length === 0 && (
        <div className="alert alert-info text-center mt-4">
          Chưa có câu hỏi nào. Hãy <Link to="/admin/questions/create">tạo mới</Link> một câu hỏi!
        </div>
      )}
    </div>
  );
};
export default AdminQuestions;