import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-wrapper">
            <div className="footer-top">
                <div className="container footer-grid">

                    {/* Column 1: Newsletter */}
                    <div className="footer-col col-newsletter">
                        <img src="/alibaba-logo.png" alt="ALIBABA FOOD Logo" className="footer-logo-img" style={{ height: '60px', objectFit: 'contain', marginBottom: '1rem' }} />
                        <p className="footer-desc">
                            Subscribe our newsletter and get discount 25%off
                        </p>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Enter Your Email" />
                            <button type="button"><i className="send-icon">&#10148;</i></button> {/* Arrow icon placeholder */}
                        </div>
                        <div className="social-links">
                            <a href="#" className="social-icon pinterest">P</a>
                            <a href="#" className="social-icon twitter">T</a>
                            <a href="#" className="social-icon facebook">F</a>
                            <a href="#" className="social-icon instagram">I</a>
                            <a href="#" className="social-icon youtube">Y</a>
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
