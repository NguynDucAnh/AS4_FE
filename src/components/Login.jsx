import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://as3-be-auth.onrender.com/api/auth/login', { username, password });
      dispatch(loginSuccess({ user: res.data, token: res.data.token }));
      navigate('/quizzes');
    } catch (err) {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center">Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" className="form-control mb-3" onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" className="form-control mb-3" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};
export default Login;