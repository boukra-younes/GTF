import React, { useState, useEffect } from 'react';
import './ActivityLog.css';
import { FiRefreshCw, FiFilter, FiSearch } from 'react-icons/fi';

function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [filterUserId, setFilterUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost/GTF/backend/getUserActivity.php?limit=${limit}&offset=${offset}`;
      if (filterUserId) {
        url += `&user_id=${filterUserId}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        // Filter by search term if provided
        let filteredActivities = data.activities;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredActivities = filteredActivities.filter(activity => 
            activity.user_name.toLowerCase().includes(term) ||
            activity.user_email.toLowerCase().includes(term) ||
            activity.action_type.toLowerCase().includes(term) ||
            activity.description.toLowerCase().includes(term)
          );
        }
        
        setActivities(filteredActivities);
        setTotalCount(data.total);
      }
    } catch (err) {
      setError('Failed to fetch activity log');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(fetchActivities, 30000);
    
    return () => clearInterval(intervalId);
  }, [limit, offset, filterUserId, searchTerm]);

  const handleRefresh = () => {
    fetchActivities();
  };

  const handleNextPage = () => {
    if (offset + limit < totalCount) {
      setOffset(offset + limit);
    }
  };

  const handlePrevPage = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getActionTypeClass = (actionType) => {
    switch (actionType) {
      case 'login':
        return 'action-login';
      case 'logout':
        return 'action-logout';
      case 'signup':
        return 'action-signup';
      case 'approve_user':
        return 'action-approve';
      case 'deactivate_user':
        return 'action-deactivate';
      case 'delete_user':
        return 'action-delete';
      case 'modify_user':
        return 'action-modify';
      default:
        return 'action-other';
    }
  };

  return (
    <div className="activity-log-container">
      <div className="activity-log-header">
        <h2>User Activity Log</h2>
        <div className="activity-controls">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <FiFilter className="filter-icon" />
            <input
              type="number"
              placeholder="Filter by user ID"
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
              className="filter-input"
            />
          </div>
        
        </div>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Loading activity data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="activity-table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Description</th>
                  
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-activities">No activities found</td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{formatDate(activity.timestamp)}</td>
                      <td>
                        <div className="user-info">
                          <span className="user-name">{activity.user_name}</span>
                          <span className="user-email">{activity.user_email}</span>
                          <span className="user-id">ID: {activity.user_id}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`action-type ${getActionTypeClass(activity.action_type)}`}>
                          {activity.action_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{activity.description}</td>
                     
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="pagination-controls">
            <div className="pagination-info">
              Showing {offset + 1} - {Math.min(offset + limit, totalCount)} of {totalCount} activities
            </div>
            <div className="pagination-buttons">
              <button 
                onClick={handlePrevPage} 
                disabled={offset === 0}
                className="pagination-button"
              >
                Previous
              </button>
              <button 
                onClick={handleNextPage} 
                disabled={offset + limit >= totalCount}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ActivityLog;