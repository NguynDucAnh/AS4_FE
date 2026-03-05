import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming register endpoint is /api/auth/register as per implementation plan
      await axios.post('https://as3-be-auth.onrender.com/api/auth/register', { username, password });
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/');
    } catch (err) {
      alert("Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại hoặc có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center">Đăng ký</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" className="form-control mb-3" onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" className="form-control mb-3" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Loading...
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>
      <div className="text-center mt-3">
        <span>Already have an account? </span>
        <Link to="/">Login here</Link>
      </div>
    </div>
  );
};

export default Register;
