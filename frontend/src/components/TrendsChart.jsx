import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const TrendsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await api.get('/expenses/trends');

        // Flatten the trend structure into chart format
        const formatted = res.data.map((entry) => {
          const row = { month: `Month ${entry._id}` };
          entry.categories.forEach((cat) => {
            row[cat.category] = cat.total;
          });
          return row;
        });

        setData(formatted);
      } catch (err) {
        console.error('Failed to load trends', err);
      }
    };

    fetchTrends();
  }, []);

  // Collect all unique category keys
  const allCategories = data.reduce((acc, curr) => {
    Object.keys(curr).forEach((key) => {
      if (key !== 'month' && !acc.includes(key)) acc.push(key);
    });
    return acc;
  }, []);

  return (
    <div>
      <h3>Spending Trends (Monthly)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {allCategories.map((cat, idx) => (
            <Bar key={cat} dataKey={cat} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendsChart;
