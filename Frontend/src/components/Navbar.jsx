import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <div className="navbar-logo">
                    <a href="#">
                        <img src="/alibaba-logo.png" alt="ALIBABA FOOD Logo" className="navbar-logo-img" style={{ height: '50px', objectFit: 'contain' }} />
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
                        <input type="text" placeholder="Search..." />
                    </div>
                    <button className="icon-btn user-btn">👤</button>
                    <button className="icon-btn cart-btn">🛒</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
