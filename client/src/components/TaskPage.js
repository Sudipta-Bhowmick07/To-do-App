import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaChevronLeft, FaEllipsisV, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [category, setCategory] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Fetch category details and tasks on component mount
  useEffect(() => {
    const fetchCategoryAndTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        
        // Fetch tasks for this specific category
        const tasksRes = await axios.get(`/api/tasks/${categoryId}`, config);
        setTasks(tasksRes.data);

        // Fetch category details to display name and icon
        const categoryRes = await axios.get(`/api/categories/${categoryId}`, config);
        setCategory(categoryRes.data);

      } catch (err) {
        console.error('Error fetching category or tasks:', err.response.data);
      }
    };

    if (categoryId) {
      fetchCategoryAndTasks();
    }
  }, [categoryId]); // Rerun effect if categoryId changes

  const handleAddTask = async () => {
    if (newTaskDescription.trim() === '') return;
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };
      
      const res = await axios.post(`/api/tasks/${categoryId}`, { description: newTaskDescription }, config);
      
      // Update the state with the new task from the server
      setTasks([...tasks, res.data]);
      setNewTaskDescription('');
      setShowModal(false);
    } catch (err) {
      console.error('Error adding task:', err.response.data);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      const res = await axios.put(`/api/tasks/${id}`, {}, config);
      
      // Update the task in the state with the new completed status from the server
      setTasks(tasks.map(task =>
        task._id === id ? res.data : task
      ));
    } catch (err) {
      console.error('Error updating task:', err.response.data);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.delete(`/api/tasks/${id}`, config);
      
      // Filter out the deleted task from the state
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err.response.data);
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <FaChevronLeft style={styles.backIcon} onClick={handleGoBack} />
          <FaEllipsisV style={styles.menuIcon} />
        </div>
        <div style={styles.headerContent}>
          <span style={styles.categoryIcon}>{category.icon}</span>
          <p style={styles.taskCount}>{tasks.length} Tasks</p>
          <h1 style={styles.categoryName}>{category.name}</h1>
        </div>
      </div>

      {/* Task List */}
      <div style={styles.taskList}>
        {tasks.map(task => (
          <div key={task._id} style={styles.taskItem}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task._id)}
              style={styles.checkbox}
            />
            <span style={task.completed ? styles.taskTextCompleted : styles.taskText}>
              {task.description}
            </span>
            <FaTrash onClick={() => handleDeleteTask(task._id)} style={styles.deleteIcon} />
          </div>
        ))}
      </div>

      {/* Add Task Button */}
      <div style={styles.plusIcon} onClick={() => setShowModal(true)}>
        <FaPlus size={24} color="#fff" />
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Add New Task</h3>
            <input
              type="text"
              placeholder="Task description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              style={styles.modalInput}
            />
            <button onClick={handleAddTask} style={styles.modalButton}>Add Task</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#e0eafc',
    padding: '0',
    position: 'relative',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#3273dc',
    color: '#fff',
    padding: '2rem 1rem 4rem 1rem',
    borderRadius: '0 0 50% 50%',
    position: 'relative',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  menuIcon: {
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  headerContent: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  categoryIcon: {
    fontSize: '4rem',
    display: 'block',
  },
  taskCount: {
    fontSize: '1rem',
    fontWeight: 'normal',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
    marginTop: '0.5rem',
  },
  categoryName: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
  },
  taskList: {
    padding: '1rem',
    marginTop: '-2rem',
    zIndex: 1,
    position: 'relative',
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '0.75rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  checkbox: {
    marginRight: '1rem',
    width: '1.25rem',
    height: '1.25rem',
    cursor: 'pointer',
  },
  taskText: {
    flex: 1,
    fontSize: '1rem',
    color: '#333',
  },
  taskTextCompleted: {
    flex: 1,
    fontSize: '1rem',
    color: '#999',
    textDecoration: 'line-through',
  },
  deleteIcon: {
    color: '#ff4d4f',
    cursor: 'pointer',
    fontSize: '1.2rem',
    marginLeft: '1rem'
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
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
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
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    textAlign: 'center',
    width: '80%',
    maxWidth: '400px',
  },
  modalInput: {
    width: 'calc(100% - 20px)',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  modalButton: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#3273dc',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default TaskPage;