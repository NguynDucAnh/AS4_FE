import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { user, token } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra quyền Admin
    if (!user || !user.admin) {
      navigate('/quizzes');
      return;
    }
    fetchQuizzes();
  }, [user, navigate]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('https://as3-be-auth.onrender.com/api/quizzes');
      setQuizzes(res.data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bộ đề này?")) {
      try {
        await axios.delete(`https://as3-be-auth.onrender.com/api/quizzes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchQuizzes();
      } catch (err) {
        alert("Bạn không có quyền xóa bộ đề này!");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Quản lý Quiz</h2>
        <Link to="/admin/quizzes/create" className="btn btn-success">Thêm Quiz</Link>
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Mô tả</th>
              <th>Số câu hỏi</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map(quiz => (
              <tr key={quiz._id}>
                <td>{quiz.title}</td>
                <td>{quiz.description}</td>
                <td>{quiz.questions?.length || 0}</td>
                <td>
                  <Link to={`/admin/quizzes/edit/${quiz._id}`} className="btn btn-warning btn-sm me-2">
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminQuizzes;
