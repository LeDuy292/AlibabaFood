import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Register.css';
import logoImg from '../assets/alibaba-logo.png.png';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        document.body.classList.add('auth-body-active');
        return () => {
            document.body.classList.remove('auth-body-active');
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        setLoading(true);
        try {
            // Sending all required fields to the backend
            const response = await api.post('/auth/register', {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                username: formData.email.split('@')[0],
                roleName: "customer"
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Đăng ký thành công!');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                toast.error(response.data.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            console.error('Registration error:', error);
            // Handling validation errors from the backend
            const backendMessage = error.response?.data?.message;
            const validationErrors = error.response?.data?.errors;

            let errorMessage = 'Không thể kết nối đến máy chủ';

            if (backendMessage) {
                errorMessage = backendMessage;
            } else if (validationErrors && Array.isArray(validationErrors)) {
                errorMessage = validationErrors[0];
            } else if (validationErrors && typeof validationErrors === 'object') {
                errorMessage = Object.values(validationErrors).flat()[0];
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-fullscreen-page" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1920)` }}>
            <div className="glass-blob glass-blob-1" style={{ background: '#ff4b4b' }}></div>
            <div className="glass-blob glass-blob-2" style={{ background: '#ff9a44' }}></div>

            <div className="auth-glass-card register-glass-card">
                <div className="auth-logo-center">
                    <Link to="/">
                        <img src={logoImg} alt="ALIBABA FOOD" />
                    </Link>
                </div>

                <div className="auth-glass-header">
                    <h2>Create Account</h2>
                    <p>Join the best food delivery service today</p>
                </div>

                <form className="auth-glass-form" onSubmit={handleSubmit}>
                    <div className="form-group-glass">
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group-glass">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-row-glass">
                        <div className="form-group-glass half-width">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group-glass half-width">
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button type="submit" className="glass-submit-btn" style={{ marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                        {!loading && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                        )}
                    </button>
                </form>

                <p className="auth-footer-glass">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
