import React, { useState } from 'react';
import api from '../services/api';

const ExpenseUpload = () => {
  const [form, setForm] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/expenses/upload', form);
      setMessage('✅ Expense uploaded successfully');
      setForm({ amount: '', category: '', description: '', date: '' });
    } catch (err) {
      setMessage('❌ Failed to upload');
    }
  };

  return (
    <div>
      <h3>Upload Expense</h3>
      <form onSubmit={handleSubmit}>
        <input name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ExpenseUpload;
