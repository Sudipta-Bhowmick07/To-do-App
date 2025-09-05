import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_no: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const { username, email, phone_no, password } = formData;

  const onChange = (e) => {
    // New validation for phone number length
    if (e.target.name === 'phone_no' && e.target.value.length > 10) {
      return; // Stop if the input is greater than 10 digits
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous messages
    setMessage('');

    // Optional: Front-end validation for 10 digits before sending
    if (phone_no.length !== 10) {
      setMessage('Phone number must be exactly 10 digits.');
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify(formData);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', body, config);
      
      console.log('Registration successful:', res.data);
      setMessage('Registered Successfully!');
      setFormData({
        username: '',
        email: '',
        phone_no: '',
        password: ''
      });

    } catch (err) {
      console.error('Registration failed:', err.response.data);
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>User Registration</h2>
        {message && (
          <p style={message === 'Registered Successfully!' ? styles.successMessage : styles.errorMessage}>
            {message}
          </p>
        )}
        <form onSubmit={onSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              name="username"
              value={username}
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              name="email"
              value={email}
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="phone_no" style={styles.label}>Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number (10 digits)"
              name="phone_no"
              value={phone_no}
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter a secure password"
                name="password"
                value={password}
                onChange={onChange}
                required
                style={styles.input}
              />
              <span
                onClick={togglePasswordVisibility}
                style={styles.passwordToggle}
              >
                {showPassword ? '🙈' : '🫣'}
              </span>
            </div>
          </div>
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <div style={styles.linkContainer}>
          <span style={styles.text}>Already have an account?</span>
          <Link to="/login" style={styles.link}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

// Updated Styles object for the component
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #e0eafc, #cfdef3)',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    width: '400px',
    textAlign: 'center'
  },
  title: {
    marginBottom: '0.5rem',
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#333'
  },
  inputGroup: {
    marginBottom: '1.5rem',
    textAlign: 'left'
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '0.4rem',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #ddd',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '0.85rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#3273dc',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginBottom: '1rem'
  },
  linkContainer: {
    marginTop: '1rem',
    fontSize: '0.9rem'
  },
  text: {
    color: '#666'
  },
  link: {
    color: '#3273dc',
    textDecoration: 'none',
    marginLeft: '0.5rem',
    fontWeight: 'bold'
  },
  successMessage: {
    color: 'green',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  passwordToggle: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '1.2rem'
  }
};

export default Register;