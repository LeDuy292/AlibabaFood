import React from 'react';
import './Footer.css';
import logoImg from '../assets/alibaba-logo.png.png';

const Footer = () => {
    return (
        <footer className="footer-wrapper">
            <div className="footer-top">
                <div className="container footer-grid">

                    {/* Column 1: Newsletter */}
                    <div className="footer-col col-newsletter">
                        <img src={logoImg} alt="ALIBABA FOOD Logo" className="footer-logo-img" style={{ height: '60px', objectFit: 'contain', marginBottom: '1rem' }} />
                        <p className="footer-desc">
                            Subscribe our newsletter and get discount 25%off
                        </p>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Enter Your Email" />
                            <button type="button"><i className="send-icon">&#10148;</i></button> {/* Arrow icon placeholder */}
                        </div>
                        <div className="social-links">
                            {/* Twitter */}
                            <a href="#" className="social-icon twitter" aria-label="Twitter">
                                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 0 0 1.88-2.37 8.57 8.57 0 0 1-2.72 1.04 4.27 4.27 0 0 0-7.28 3.9A12.12 12.12 0 0 1 3.15 4.78a4.27 4.27 0 0 0 1.32 5.7 4.24 4.24 0 0 1-1.93-.53v.05a4.27 4.27 0 0 0 3.42 4.18 4.3 4.3 0 0 1-1.93.07 4.27 4.27 0 0 0 3.99 2.97A8.57 8.57 0 0 1 2 19.54a12.1 12.1 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2l-.01-.56A8.7 8.7 0 0 0 22.46 6z" />
                                </svg>
                            </a>
                            {/* Facebook */}
                            <a href="#" className="social-icon facebook" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.84c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99C18.34 21.12 22 17 22 12z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" className="social-icon instagram" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.92 4.92 0 0 1 1.772 1.153 4.9 4.9 0 0 1 1.153 1.772c.163.46.35 1.26.403 2.43.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.9 4.9 0 0 1-1.153 1.772 4.92 4.92 0 0 1-1.772 1.153c-.46.163-1.26.35-2.43.403-1.265.058-1.645.07-4.85.07s-3.584-.012-4.849-.07c-1.17-.054-1.97-.24-2.43-.403a4.9 4.9 0 0 1-1.772-1.153A4.9 4.9 0 0 1 1.77 19.28c-.163-.46-.35-1.26-.403-2.43C1.31 15.584 1.3 15.204 1.3 12s.012-3.584.07-4.849c.054-1.17.24-1.97.403-2.43A4.9 4.9 0 0 1 2.926 2.95 4.92 4.92 0 0 1 4.698 1.8c.46-.163 1.26-.35 2.43-.403C8.393 1.34 8.773 1.328 12 1.328zm0 1.838c-3.146 0-3.5.011-4.73.068-1.068.049-1.648.226-2.035.376a3.08 3.08 0 0 0-1.145.744 3.08 3.08 0 0 0-.744 1.145c-.15.386-.327.967-.376 2.035C2.923 8.473 2.91 8.827 2.91 12c0 3.146.011 3.5.068 4.73.049 1.068.226 1.648.376 2.035.177.47.41.82.744 1.145.326.334.675.567 1.145.744.386.15.967.327 2.035.376C8.473 21.08 8.827 21.09 12 21.09c3.146 0 3.5-.011 4.73-.068 1.068-.049 1.648-.226 2.035-.376a3.08 3.08 0 0 0 1.145-.744c.334-.326.567-.675.744-1.145.15-.386.327-.967.376-2.035.057-1.23.068-1.584.068-4.73 0-3.146-.011-3.5-.068-4.73-.049-1.068-.226-1.648-.376-2.035a3.08 3.08 0 0 0-.744-1.145 3.08 3.08 0 0 0-1.145-.744c-.386-.15-.967-.327-2.035-.376C15.473 3.01 15.146 3 12 3zm0 3.13a5.87 5.87 0 1 1 0 11.74A5.87 5.87 0 0 1 12 6.13zm0 1.838a4.032 4.032 0 1 0 0 8.065 4.032 4.032 0 0 0 0-8.065zm5.08-2.185a1.37 1.37 0 1 1 0 2.74 1.37 1.37 0 0 1 0-2.74z" />
                                </svg>
                            </a>
                            {/* YouTube */}
                            <a href="#" className="social-icon youtube" aria-label="YouTube">
                                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.38.46A3.02 3.02 0 0 0 .5 6.2 31.8 31.8 0 0 0 0 12a31.8 31.8 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.4 12 20.4 12 20.4s7.5 0 9.38-.46a3.02 3.02 0 0 0 2.12-2.14A31.8 31.8 0 0 0 24 12a31.8 31.8 0 0 0-.5-5.8zM9.75 15.52V8.48L15.86 12l-6.11 3.52z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Contact us */}
                    <div className="footer-col col-contact">
                        <h3 className="footer-title">Contact us</h3>
                        <ul className="contact-list">
                            <li><i className="icon location-icon"></i> Kolkata India, 3rd Floor, Office 45</li>
                            <li><i className="icon phone-icon"></i> 00985 - 98859986</li>
                            <li><i className="icon email-icon"></i> M.AlyaQout@4house.Co</li>
                            <li><i className="icon clock-icon"></i> Sun - Sat / 10:00 AM - 8:00 PM</li>
                        </ul>
                    </div>

                    {/* Column 3: Links */}
                    <div className="footer-col col-links">
                        <h3 className="footer-title">Links</h3>
                        <ul className="links-list">
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Our Menu</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Instagram/Photo Grid */}
                    <div className="footer-col col-gallery">
                        <div className="gallery-grid">
                            <img src="https://images.unsplash.com/photo-1555126634-323283e090fa?w=100&h=100&fit=crop" alt="Gallery 1" />
                            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop" alt="Gallery 2" />
                            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop" alt="Gallery 3" />
                            <img src="https://images.unsplash.com/photo-1493770348161-369560ae357d?w=100&h=100&fit=crop" alt="Gallery 4" />
                            <img src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=100&h=100&fit=crop" alt="Gallery 5" />
                            <img src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=100&h=100&fit=crop" alt="Gallery 6" />
                        </div>
                    </div>
                </div>

                {/* Decorative elements - absolute positioned using CSS */}
                <div className="leaf-decor left"></div>
                <div className="broccoli-decor right"></div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="container bottom-bar-flex">
                    <p className="copyright">Copyright &copy; 2024 Shawon3 Themes. All rights reserved</p>
                    <div className="bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Term of Use</a>
                        <a href="#">Partner</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
