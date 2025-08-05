import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseUpload from '../components/ExpenseUpload';
import ExpenseHistory from '../components/ExpenseHistory';
import TrendsChart from '../components/TrendsChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedName = sessionStorage.getItem('name');
    setUserName(storedName || 'User');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: 'linear-gradient(to right, #4facfe, #00f2fe)',
        padding: '30px 0',
      }}
    >
      <div className="container">
        {/* Top Bar */}
        <div className="d-flex justify-content-between align-items-center mb-5 px-3">
          <h2 className="text-white fw-bold mb-0">Welcome, {userName}</h2>
          <button onClick={handleLogout} className="btn btn-light btn-sm px-4 py-2 fw-bold shadow-sm">
            Logout
          </button>
        </div>

        {/* Upload Card */}
        <div className="card shadow-lg mb-5 rounded-4 border-0">
          <div className="card-header bg-primary text-white rounded-top-4">
            <h4 className="mb-0">📤 Upload Expense</h4>
          </div>
          <div className="card-body">
            <ExpenseUpload />
          </div>
        </div>

        {/* Expense History */}
        <div className="card shadow-lg mb-5 rounded-4 border-0">
          <div className="card-header bg-success text-white rounded-top-4">
            <h4 className="mb-0">📋 Expense History</h4>
          </div>
          <div className="card-body">
            <ExpenseHistory />
          </div>
        </div>

        {/* Trends Chart */}
        <div className="card shadow-lg mb-5 rounded-4 border-0">
          <div className="card-header bg-warning text-dark rounded-top-4">
            <h4 className="mb-0">📈 Spending Trends</h4>
          </div>
          <div className="card-body">
            <TrendsChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
