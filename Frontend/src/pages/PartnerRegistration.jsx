import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PartnerRegistration.css';
import logoImg from '../assets/alibaba-logo.png.png';

const PartnerRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        businessType: 'restaurant',
        certificateFile: null,
        agreeTerms: false,
    });

    // Ensure full screen overflow hidden for auth pages
    useEffect(() => {
        document.body.classList.add('auth-body-active');
        return () => {
            document.body.classList.remove('auth-body-active');
        };
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            setFormData(prevState => ({ ...prevState, [name]: checked }));
        } else if (type === 'file') {
            setFormData(prevState => ({ ...prevState, [name]: files[0] }));
        } else {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.agreeTerms) {
            alert('Please agree to our Terms of Service.');
            return;
        }
        if (!formData.certificateFile) {
            alert('Please upload your Food Safety Certificate.');
            return;
        }
        console.log('Partner Registration Data:', formData);
        // Simulate successful registration redirect to a "thank you" or back to home
        alert('Registration Successful! Our team will contact you shortly.');
        navigate('/');
    };

    return (
        <div className="auth-fullscreen-page" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1920)` }}>

            {/* Decorative blurred blobs for extra glass effect */}
            <div className="glass-blob glass-blob-1" style={{ background: '#00c6ff', filter: 'blur(90px)' }}></div>
            <div className="glass-blob glass-blob-2" style={{ background: '#0072ff', width: '350px', height: '350px' }}></div>

            <div className="auth-glass-card partner-glass-card">
                <div className="auth-logo-center">
                    <Link to="/">
                        <img src={logoImg} alt="ALIBABA FOOD" />
                    </Link>
                </div>

                <div className="auth-glass-header">
                    <h2>Partner With Us</h2>
                    <p>Grow your business with AlibabaFood's delivery network.</p>
                </div>

                <form className="auth-glass-form partner-form-grid" onSubmit={handleSubmit}>

                    <div className="form-group-glass full-width-field">
                        <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder="Business / Restaurant Name"
                            required
                        />
                    </div>

                    <div className="form-row-glass">
                        <div className="form-group-glass half-width">
                            <input
                                type="text"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                placeholder="Contact Person Name"
                                required
                            />
                        </div>
                        <div className="form-group-glass half-width">
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group-glass full-width-field">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Business Email Address"
                            required
                        />
                    </div>

                    <div className="form-group-glass full-width-field">
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Full Business Address"
                            required
                        />
                    </div>

                    <div className="form-group-glass full-width-field select-glass-container">
                        <select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                            className="glass-select"
                            required
                        >
                            <option value="restaurant">Restaurant / Eatery</option>
                            <option value="cafe">Cafe / Bakery</option>
                            <option value="grocery">Grocery Store</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group-glass full-width-field file-upload-glass">
                        <label className="upload-label">Food Safety Certificate (*)</label>
                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                id="certificateFile"
                                name="certificateFile"
                                onChange={handleChange}
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="glass-file-input"
                                required
                            />
                            <div className="file-dummy">
                                {formData.certificateFile ? formData.certificateFile.name : 'Choose file (JPG, PNG, PDF)...'}
                            </div>
                        </div>
                    </div>

                    <div className="form-options-glass mt-3">
                        <label className="checkbox-glass terms-checkbox">
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                required
                            />
                            <span className="checkmark"></span>
                            I agree to AlibabaFood's <Link to="/terms" className="forgot-password-glass">Terms of Service</Link>
                        </label>
                    </div>

                    <button type="submit" className="glass-submit-btn partner-submit-btn">
                        Submit Application
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </button>
                </form>

                <p className="auth-footer-glass">
                    Already a partner? <Link to="/login">Login to Dashboard</Link>
                </p>
            </div>
        </div>
    );
};

export default PartnerRegistration;
