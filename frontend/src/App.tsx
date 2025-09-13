import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import Research from './Pages/Research';
import heartLogo from './assets/litlogo.jpg'; // Adjust path as needed
import './App.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav-container ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-content">
        <Link to="/" className="logo">
          <img 
            src={heartLogo} 
            alt="Site Logo" 
            className="logo-image"
          />
        </Link>
        
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <ul className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          </li>
          <li className={location.pathname === '/research' ? 'active' : ''}>
            <Link to="/research" onClick={() => setIsMenuOpen(false)}>Research</Link> 
          </li>
          <li className={location.pathname === '/about' ? 'active' : ''}>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/research" element={<Research />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;