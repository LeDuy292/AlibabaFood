import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Login.css';
import logoImg from '../assets/alibaba-logo.png.png';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        document.body.classList.add('auth-body-active');
        return () => {
            document.body.classList.remove('auth-body-active');
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Đăng nhập thành công!');
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));

                // Small delay to let user see the success toast
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                toast.error(response.data.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Không thể kết nối đến máy chủ';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-fullscreen-page" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1920)` }}>
            <div className="glass-blob glass-blob-1"></div>
            <div className="glass-blob glass-blob-2"></div>

            <div className="auth-glass-card">
                <div className="auth-logo-center">
                    <Link to="/">
                        <img src={logoImg} alt="ALIBABA FOOD" />
                    </Link>
                </div>

                <div className="auth-glass-header">
                    <h2>Welcome Back</h2>
                    <p>Login to your account to continue ordering</p>
                </div>

                <form className="auth-glass-form" onSubmit={handleSubmit}>
                    <div className="form-group-glass">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group-glass">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-options-glass">
                        <label className="checkbox-glass">
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                        <Link to="#" className="forgot-password-glass">Forgot Password?</Link>
                    </div>

                    <button type="submit" className="glass-submit-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                        {!loading && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        )}
                    </button>
                </form>

                <div className="auth-divider-glass">
                    <span>or sign in with</span>
                </div>

                <div className="social-login-glass">
                    <button className="glass-social-btn" disabled={loading}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                </div>

                <p className="auth-footer-glass">
                    New to AlibabaFood? <Link to="/register">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
