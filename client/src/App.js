import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; // Import the new Dashboard component
import TaskPage from './components/TaskPage'; // Import TaskPage

function App() {
  return (
    <Router>
      <div style={styles.appContainer}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/tasks/:categoryId" element={<TaskPage />} /> {/* The new route */}
          {/* Default route to redirect to the login page */}
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #e0eafc, #cfdef3)'
  }
};

export default App;