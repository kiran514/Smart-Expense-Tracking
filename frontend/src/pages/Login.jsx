import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ emailOrMobile: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      sessionStorage.setItem('name', res.data.name);
      onLogin(); // navigate to dashboard
    } catch (err) {
      setError('❌ Invalid credentials');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: 'linear-gradient(to right, #4facfe, #00f2fe)',
        backgroundSize: 'cover',
      }}
    >
      <div className="card p-4 shadow" style={{ minWidth: '350px', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              name="emailOrMobile"
              className="form-control"
              placeholder="Email or Mobile"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              name="password"
              className="form-control"
              placeholder="Password"
              type="password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          {error && <p className="text-danger mt-2 text-center">{error}</p>}
        </form>
        <div className="text-center mt-3">
          Don't have an account?{' '}
          <Link to="/register" className="text-decoration-none text-primary">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
