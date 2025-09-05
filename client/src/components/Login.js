import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify({ email, password });
            
            const res = await axios.post('/api/auth/login', body, config);
            
            console.log('Login successful!', res.data);
            
            // Store the token in localStorage
            localStorage.setItem('token', res.data.token);

            // Redirect to the dashboard or show a success message
            window.location.href = '/dashboard';
            
        } catch (err) {
            console.error('Login error:', err.response.data);
            setError('Invalid credentials');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>User Login</h2>
                {error && <p style={styles.errorMessage}>{error}</p>}
                <form onSubmit={onSubmit}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="email" style={styles.label}>Email Address</label>
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="Enter your email address"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                style={styles.input}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                minLength="6"
                                required
                            />
                            <span
                                onClick={togglePasswordVisibility}
                                style={styles.passwordToggle}
                            >
                                {showPassword ? '🙈' : '🫣'}
                            </span>
                        </div>
                    </div>
                    <button style={styles.button} type="submit">Login</button>
                </form>
                <div style={styles.linkContainer}>
                    <span style={styles.text}>Don't have an account?</span>
                    <Link to="/register" style={styles.link}>Register here</Link>
                </div>
            </div>
        </div>
    );
};

// Styles object to match the Register component
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

export default Login;
