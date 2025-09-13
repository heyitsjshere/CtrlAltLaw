import React, { useEffect, useRef, useCallback } from 'react';
import './About.css';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  // Array of refs, one for each section
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Handles attaching refs dynamically
  const addToRefs = useCallback((el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  }, []);

  // Intersection Observer
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

  // Copy the ref array at the start of the effect
  const refs = sectionRefs.current;

  refs.forEach((ref) => {
    if (ref) observer.observe(ref);
  });

  // Use that same refs array in the cleanup
  return () => {
    refs.forEach((ref) => {
      if (ref) observer.unobserve(ref);
    });
  };
}, []);


  // Mission stats counter animation
  useEffect(() => {
    // Find the mission-section ref
    const missionSection = sectionRefs.current.find(
      (ref) => ref && ref.classList.contains('mission-section')
    );

    if (missionSection) {
      const missionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateNumbers();
              missionObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      missionObserver.observe(missionSection);
    }

    function animateNumbers() {
      const statElements = document.querySelectorAll('.stat-number');
      statElements.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-count') || '0', 10);
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            stat.textContent = target.toString();
            clearInterval(timer);
          } else {
            stat.textContent = Math.round(current).toString();
          }
        }, duration / steps);
      });
    }
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="home-hero" ref={addToRefs}>
        <div className="hero-content">
          <h1 className="hero-title" style={{ color: "#8B3A00" }}>
            <span> About Us </span><br/>
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

      {/* Mission Section */}
      <section className="mission-section section-padding" ref={addToRefs}>
        <div className="container">
          <div className="section-header">
            <h2>Our Mission</h2>
            <div className="accent-line"></div>
          </div>
          <div className="mission-content">
            <p className="mission-statement">
              PolicyInsight is dedicated to democratizing access to government policies 
              and ministerial statements. We believe that transparent information strengthens 
              democracy and empowers informed civic engagement.
            </p>
            <div className="mission-stats">
              <div className="stat">
                <div className="stat-number" data-count="1000">0</div>
                <div className="stat-label">Policy Documents</div>
              </div>
              <div className="stat">
                <div className="stat-number" data-count="95">0</div>
                <div className="stat-label">Accuracy Rate</div>
              </div>
              <div className="stat">
                <div className="stat-number" data-count="24">0</div>
                <div className="stat-label">Hour Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section-padding" ref={addToRefs}>
        <div className="container">
          <div className="section-header">
            <h2>Dual Perspective Approach</h2>
            <div className="accent-line"></div>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚖️</div>
              <h3>For Legal Professionals</h3>
              <p style={{ color:"black"}}>
                Access precise quotes with source verification, reliability ratings, 
                and direct links to original documents for comprehensive legal research.
              </p>
              <ul className="feature-list">
                <li>Direct source citations</li>
                <li>Reliability scoring system</li>
                <li>Advanced search filters</li>
                <li>Export functionality</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>For the General Public</h3>
              <p style={{ color:"black"}}>
                Get clear, concise summaries of complex policy statements without legal jargon. 
                Understand government positions in straightforward language.
              </p>
              <ul className="feature-list">
                <li>Simplified explanations</li>
                <li>Visual policy timelines</li>
                <li>FAQ sections</li>
                <li>Related topics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section section-padding" ref={addToRefs}>
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <div className="accent-line"></div>
          </div>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h4>Ask Your Question</h4>
                <p>Enter a natural language question about any policy area or ministerial statement.</p>
              </div>
              <div className="step-connector"></div>
            </div>
            
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h4>Choose Your Perspective</h4>
                <p>Select between legal professional view or general public view based on your needs.</p>
              </div>
              <div className="step-connector"></div>
            </div>
            
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h4>Get Verified Answers</h4>
                <p>Receive accurate information with source attribution and reliability assessments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section section-padding" ref={addToRefs}>
        <div className="container">
          <div className="section-header">
            <h2>Advanced Technology</h2>
            <div className="accent-line"></div>
          </div>
          <div className="tech-content">
            <div className="tech-description">
              <p>
                PolicyInsight uses advanced natural language processing and machine learning 
                algorithms to analyze thousands of government documents, parliamentary records, 
                and policy statements. Our system cross-references information across multiple 
                sources to ensure accuracy and provide context-aware responses.
              </p>
              <div className="tech-features">
                <div className="tech-feature">
                  <span className="feature-dot"></span>
                  <span>Natural Language Processing</span>
                </div>
                <div className="tech-feature">
                  <span className="feature-dot"></span>
                  <span>Machine Learning Algorithms</span>
                </div>
                <div className="tech-feature">
                  <span className="feature-dot"></span>
                  <span>Cross-Source Verification</span>
                </div>
                <div className="tech-feature">
                  <span className="feature-dot"></span>
                  <span>Contextual Understanding</span>
                </div>
              </div>
            </div>
            <div className="tech-visual">
              <div className="orbital-system">
                <div className="center-orb"></div>
                <div className="orbit orbit-1">
                  <div className="orbiting-element">NLP</div>
                </div>
                <div className="orbit orbit-2">
                  <div className="orbiting-element">AI</div>
                </div>
                <div className="orbit orbit-3">
                  <div className="orbiting-element">Data</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section-padding" ref={addToRefs}>
        <div className="container">
          <h2>Ready to Explore Policy Insights?</h2>
          <p>Start your research today with our comprehensive policy analysis tool</p>
          <div className="cta-buttons">
            <Link to = "../research">
            <button className="cta-button secondary">Get Started</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>LawHive</h3>
              <p>Democratising access to policy information</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
