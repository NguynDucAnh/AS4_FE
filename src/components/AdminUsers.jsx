import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ username: '', admin: false });
  const { user, token } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin permissions
    if (!user || !user.admin) {
      navigate('/quizzes');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://as3-be-auth.onrender.com/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu", err);
      setUsers([]);
    }
  };

  const handleEdit = (userData) => {
    setEditingId(userData._id);
    setEditData({ username: userData.username, admin: userData.admin });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ username: '', admin: false });
  };

  const handleSaveEdit = async (userId) => {
    try {
      await axios.put(`https://as3-be-auth.onrender.com/api/users/${userId}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
      handleCancelEdit();
      alert("Cập nhật người dùng thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật", err);
      alert("Bạn không có quyền cập nhật người dùng này!");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await axios.delete(`https://as3-be-auth.onrender.com/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
        alert("Xóa người dùng thành công!");
      } catch (err) {
        console.error("Lỗi xóa", err);
        alert("Bạn không có quyền xóa người dùng này!");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Quản lý Người dùng</h2>
      </div>
      
      {users.length === 0 ? (
        <div className="alert alert-info text-center">
          Chưa có người dùng nào.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tên người dùng</th>
                <th>Quyền Admin</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <small className="text-muted">{u._id}</small>
                  </td>
                  <td>
                    {editingId === u._id ? (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editData.username}
                        onChange={e => setEditData({ ...editData, username: e.target.value })}
                      />
                    ) : (
                      u.username
                    )}
                  </td>
                  <td>
                    {editingId === u._id ? (
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={editData.admin}
                          onChange={e => setEditData({ ...editData, admin: e.target.checked })}
                          id={`admin_${u._id}`}
                        />
                        <label className="form-check-label" htmlFor={`admin_${u._id}`}>
                          Admin
                        </label>
                      </div>
                    ) : (
                      <span className={`badge ${u.admin ? 'bg-danger' : 'bg-secondary'}`}>
                        {u.admin ? 'Admin' : 'User'}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId === u._id ? (
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(u._id)}
                          className="btn btn-success btn-sm"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn btn-secondary btn-sm"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="btn btn-warning btn-sm"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
