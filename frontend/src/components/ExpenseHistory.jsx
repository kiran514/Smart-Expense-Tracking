import React, { useEffect, useState } from 'react';
import api from '../services/api';

// Utility to group expenses by month and year
const groupByMonth = (expenses) => {
  const groups = {};
  expenses.forEach((exp) => {
    const date = new Date(exp.date);
    const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(exp);
  });
  return groups;
};

const ExpenseHistory = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', category: '', description: '' });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/expenses/history');
        setExpenses(res.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };
    fetchExpenses();
  }, []);

  const groupedExpenses = groupByMonth(expenses);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const startEditing = (exp) => {
    setEditingId(exp._id);
    setEditForm({
      amount: exp.amount,
      category: exp.category,
      description: exp.description,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ amount: '', category: '', description: '' });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/expenses/${id}`, editForm);
      setExpenses((prev) =>
        prev.map((e) => (e._id === id ? { ...e, ...editForm } : e))
      );
      cancelEditing();
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  const handleExport = () => {
    const flatData = Object.values(groupedExpenses).flat();
    const csv = [
      ['Date', 'Amount', 'Category', 'Description'],
      ...flatData.map((e) => [
        new Date(e.date).toLocaleDateString(),
        e.amount,
        e.category,
        `"${e.description}"`,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'expense-history.csv';
    link.click();
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Expense History</h3>
        <button className="btn btn-outline-primary btn-sm" onClick={handleExport}>
          ⬇️ Export CSV
        </button>
      </div>

      {Object.keys(groupedExpenses).length === 0 ? (
        <p className="text-muted">No expenses found</p>
      ) : (
        Object.entries(groupedExpenses).map(([monthYear, monthExpenses]) => (
          <div className="mb-4" key={monthYear}>
            <div className="bg-light border-start border-4 border-success p-3 rounded mb-2">
              <h5 className="mb-0 fw-bold text-success">{monthYear}</h5>
            </div>
            <ul className="list-group shadow-sm">
              {monthExpenses.map((exp) => (
                <li key={exp._id} className="list-group-item">
                  {editingId === exp._id ? (
                    <div className="row g-2 align-items-center">
                      <div className="col-md-2">
                        <input
                          type="number"
                          name="amount"
                          value={editForm.amount}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          type="text"
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-4 d-flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => saveEdit(exp._id)}>
                          💾 Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>₹{exp.amount}</strong> – {exp.category}
                        <br />
                        <small className="text-muted">{exp.description}</small>
                      </div>
                      <div className="d-flex gap-2">
                        <span className="badge bg-secondary">
                          {new Date(exp.date).toLocaleDateString()}
                        </span>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => startEditing(exp)}>
                          ✏️
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(exp._id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseHistory;
