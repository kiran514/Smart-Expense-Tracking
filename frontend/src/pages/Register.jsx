import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    emailOrMobile: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isValidMobile = (value) =>
    /^[6-9]\d{9}$/.test(value); // 10-digit Indian mobile numbers starting with 6–9

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, emailOrMobile, password, confirmPassword } = form;

    if (!name || !emailOrMobile || !password || !confirmPassword) {
      setError('❌ All fields are required.');
      return;
    }

    const isEmail = isValidEmail(emailOrMobile);
    const isMobile = isValidMobile(emailOrMobile);

    if (!isEmail && !isMobile) {
      setError('❌ Enter a valid email or mobile number');
      return;
    }

    if (password.length < 6) {
      setError('❌ Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('❌ Passwords do not match');
      return;
    }

try {
  const res = await api.post('/auth/register', {
    name,
    email: isEmail ? emailOrMobile : '',
    mobile: isMobile ? emailOrMobile : '',
    password,
  });

  setSuccess('✅ Registration successful! Redirecting to login...');
  setError('');
  setTimeout(() => navigate('/login'), 5000);
} catch (err) {
  if (err.response && err.response.status === 409) {
    setError('❌ This email or mobile is already registered.');
  } else {
    setError('❌ Registration failed. Try again.');
  }
  setSuccess('');
}
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: 'linear-gradient(to right, #43e97b, #38f9d7)',
        backgroundSize: 'cover',
      }}
    >
      <div className="card p-4 shadow" style={{ minWidth: '350px', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              name="name"
              className="form-control"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              name="emailOrMobile"
              className="form-control"
              placeholder="Email or Mobile"
              value={form.emailOrMobile}
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
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
        {success && <p className="text-success mt-3 text-center">{success}</p>}
        <div className="text-center mt-3">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none text-primary">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
