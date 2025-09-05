import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', icon: '' });
  const [user, setUser] = useState({});
  const [totalTasks, setTotalTasks] = useState(0);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      // Fetch user data
      const userRes = await axios.get('/api/auth', config);
      setUser(userRes.data);

      // Fetch categories and their task counts
      const categoriesRes = await axios.get('/api/categories', config);
      setCategories(categoriesRes.data);

      // Calculate total tasks from the fetched categories
      const total = categoriesRes.data.reduce((acc, category) => acc + category.tasks, 0);
      setTotalTasks(total);
    } catch (err) {
      console.error('Error fetching dashboard data:', err.response.data);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddCategory = async () => {
    if (newCategory.name.trim() === '') {
      console.error('Category name cannot be empty!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };
      const res = await axios.post('/api/categories', newCategory, config);
      
      // After adding, re-fetch all dashboard data to get the updated list and counts
      fetchDashboardData(); 

      setNewCategory({ name: '', icon: '' });
      setShowModal(false);
    } catch (err) {
      console.error('Error adding category:', err.response.data);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.delete(`/api/categories/${id}`, config);
      
      // After deleting, re-fetch all dashboard data
      fetchDashboardData();
    } catch (err) {
      console.error('Error deleting category:', err.response.data);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/tasks/${categoryId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}>Hello {user.name ? user.name : 'User'}</h1>
        <p style={styles.subtitle}>Today you have {totalTasks} tasks</p>
        <div style={styles.logoutButton} onClick={handleLogout}>
          <FaSignOutAlt size={24} color="#fff" />
        </div>
      </div>

      <div style={styles.categoriesGrid}>
        {categories.map(category => (
          <div 
            key={category._id} 
            style={styles.categoryCard} 
            onClick={() => handleCategoryClick(category._id)}
          >
            <div style={styles.cardHeader}>
              <span style={styles.categoryIcon}>{category.icon}</span>
              <h3 style={styles.categoryName}>{category.name}</h3>
              <FaTrash
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(category._id);
                }}
                style={styles.deleteIcon}
              />
            </div>
            <p style={styles.taskCount}>{category.tasks} Tasks</p>
          </div>
        ))}
      </div>

      <div style={styles.plusIcon} onClick={() => setShowModal(true)}>
        <FaPlus size={24} color="#fff" />
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Add New Category</h3>
              <FaTimes onClick={() => setShowModal(false)} style={{ cursor: 'pointer' }} />
            </div>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              style={styles.modalInput}
            />
            <input
              type="text"
              placeholder="Icon (e.g., 🚀)"
              value={newCategory.icon}
              onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
              style={styles.modalInput}
            />
            <button onClick={handleAddCategory} style={styles.modalButton}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
    dashboardContainer: {
        minHeight: '100vh',
        background: '#e0eafc',
        padding: '2rem 1rem',
        position: 'relative'
    },
    header: {
        backgroundColor: '#3273dc',
        color: '#fff',
        padding: '2rem',
        borderRadius: '1rem',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative'
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
        margin: 0
    },
    subtitle: {
        fontSize: '1rem',
        margin: '0.5rem 0 0 0'
    },
    logoutButton: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        cursor: 'pointer'
    },
    categoriesGrid: {
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    },
    categoryCard: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        cursor: 'pointer',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    categoryIcon: {
        fontSize: '2rem',
        marginRight: '1rem',
    },
    categoryName: {
        fontSize: '1.2rem',
        fontWeight: '600',
        margin: 0,
        flexGrow: 1,
    },
    taskCount: {
        fontSize: '0.9rem',
        color: '#666',
        margin: 0,
    },
    plusIcon: {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        backgroundColor: '#3273dc',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        width: '90%',
        maxWidth: '400px',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    modalInput: {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    modalButton: {
        width: '100%',
        padding: '0.85rem',
        backgroundColor: '#3273dc',
        color: '#fff',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        cursor: 'pointer',
    },
    deleteIcon: {
        cursor: 'pointer',
        color: '#ff4d4f',
        marginLeft: 'auto',
        fontSize: '1.2rem',
        transition: 'transform 0.2s',
    }
};

export default Dashboard;