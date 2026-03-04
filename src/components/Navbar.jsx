import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/quizzes">Thi Trắc Nghiệm</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/quizzes">Danh sách làm bài</Link>
            </li>
            {/* Chỉ Admin có quyền xem các menu quản lý */}
            {user.admin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/questions">Quản lý Câu hỏi</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/quizzes">Quản lý Quiz</Link>
                </li>
              </>
            )}
          </ul>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Đăng xuất ({user.username})
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;