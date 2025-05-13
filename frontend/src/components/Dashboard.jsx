import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './Dashboard.css';

Chart.register(...registerables);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost/GTF/backend/getDashboardStats.php', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;
  if (!stats) return <div className="dashboard-error">No data available</div>;

  const activityData = {
    labels: stats.activityLabels,
    datasets: [
      {
        label: 'User Activity',
        data: stats.activityData,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total Users</h3>
          <p className="summary-value">{stats.totalUsers}</p>
        </div>
        <div className="summary-card">
          <h3>Pending Approvals</h3>
          <p className="summary-value">{stats.pendingApprovals}</p>
        </div>
        <div className="summary-card">
          <h3>Recent Activity</h3>
          <p className="summary-value">{stats.recentActivity}</p>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Activity Over Time</h3>
          <Line data={activityData} options={{ responsive: true }} />
        </div>
        
        <div className="chart-container">
          <h3>User Distribution</h3>
          <Bar 
            data={{
              labels: stats.userTypes,
              datasets: [
                {
                  label: 'User Types',
                  data: stats.userCounts,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                  ],
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-button">View Reports</button>
          <button className="action-button">Manage Users</button>
          <button className="action-button">System Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;