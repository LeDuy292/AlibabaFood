import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logoImg from '../assets/alibaba-logo.png.png';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Clean up the event listener on component unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container container">
                <div className="navbar-logo">
                    <a href="#">
                        <img src={logoImg} alt="ALIBABA FOOD Logo" className="navbar-logo-img" style={{ height: '50px', objectFit: 'contain' }} />
                    </a>
                </div>

                <ul className="navbar-links">
                    <li><a href="#" className="active">HOME</a></li>
                    <li><a href="#">MENU</a></li>
                    <li><a href="#">NEWS</a></li>
                    <li><a href="#">SUPPORT</a></li>
                    <li><a href="#">ABOUT US</a></li>
                </ul>

                <div className="navbar-actions">
                    <div className="search-bar">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Search" />
                    </div>
                    <button className="icon-btn user-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 12c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8z" />
                        </svg>
                    </button>
                    <button className="icon-btn cart-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
