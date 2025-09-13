import React, { useEffect, useRef, useCallback } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const sectionRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  // copy ref array to a local variable
  const sections = [...sectionRefs.current];
  sections.forEach((ref) => ref && observer.observe(ref));

  return () => {
    sections.forEach((ref) => ref && observer.unobserve(ref));
  };
}, []);


  const addToRefs = useCallback((el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero" ref={addToRefs}>
        <div className="hero-content">
          <h1 className="hero-title" style={{ color: "#8B3A00" }}>
            <span>Welcome to LawHive</span><br/>
            <span>Explore, Understand, Empower</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate tool for accessing, understanding, and analyzing government policies.
          </p>
          <div className="scroll-indicator">
            <span>Scroll to discover</span>
            <div className="arrow"></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">📜</div>
            <h4>Verified Policies</h4>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🔍</div>
            <h4>Smart Search</h4>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">⚡</div>
            <h4>Quick Insights</h4>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section-padding" ref={addToRefs}>
        <div className="container">
          <h2>Get Started with PolicyInsight</h2>
          <p>Empower yourself with verified information and actionable insights.</p>
          <div className="cta-buttons">
            
            <button className="cta-button secondary">Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
