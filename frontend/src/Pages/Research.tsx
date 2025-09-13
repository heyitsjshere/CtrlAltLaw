import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Research.css';

const Research: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState<any>(null);
  const [userType, setUserType] = useState<'lawyer' | 'layperson'>('layperson');
  const [isLoading, setIsLoading] = useState(false);
  const sectionRefs = useRef<HTMLDivElement[]>([]);

  // Mock data
  const mockQuotes = [
    {
      id: 1,
      text: "We are committed to building 100,000 new housing units by 2025 to address the current shortage.",
      source: "Ministerial Statement on Housing Policy 2024",
      url: "https://example.com/housing-policy-2024",
      date: "2024-03-15",
      reliability: 95
    },
    {
      id: 2,
      text: "First-time home buyers will receive additional subsidies of up to $50,000 under the new scheme.",
      source: "Parliamentary Debates on Housing Bill",
      url: "https://example.com/housing-debate-2024",
      date: "2024-02-28",
      reliability: 92
    }
  ];

  const mockSummary = "The Minister announced plans to build 100,000 new housing units by 2025 and increased subsidies for first-time home buyers. The government is taking a multi-pronged approach to address housing affordability concerns.";

  const policyTimeline = [
    { date: "2020", policy: "Initial housing scheme with basic subsidies" },
    { date: "2022", policy: "Expanded subsidies for middle-income families" },
    { date: "2024", policy: "Major overhaul with 100,000 new units and increased subsidies" }
  ];

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

    const currentSections = sectionRefs.current;
    currentSections.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentSections.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const addToRefs = useCallback((el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setResults({
        quotes: mockQuotes,
        summary: mockSummary,
        timeline: policyTimeline
      });
      setIsLoading(false);
    }, 1500);
  };

  const renderReliabilityIndicator = (score: number) => {
    let color = '#4caf50';
    if (score < 70) color = '#f44336';
    else if (score < 85) color = '#ff9800';
    
    return (
      <div className="reliability-indicator">
        <div className="reliability-score" style={{ color }}>
          {score}%
        </div>
        <div className="reliability-bar">
          <div 
            className="reliability-fill" 
            style={{ width: `${score}%`, backgroundColor: color }}
          ></div>
        </div>
      </div>
    );
  };

  // SVG Icons
  const SearchIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
    </svg>
  );

  const LawyerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 11V8C16.21 8 18 6.21 18 4H20C20 6.97 17.61 9.37 14.69 9.9C15.07 10.13 15.41 10.43 15.71 10.79L17.83 8.67C18.03 8.46 18.38 8.46 18.58 8.67L19.32 9.41C19.53 9.62 19.53 9.97 19.32 10.17L17.2 12.29C17.38 12.63 17.5 13 17.5 13.5C17.5 14.88 16.38 16 15 16C13.62 16 12.5 14.88 12.5 13.5C12.5 12.12 13.62 11 15 11H14ZM5 19V5C5 3.9 5.9 3 7 3H17C18.1 3 19 3.9 19 5V9.05C18.84 9.02 18.67 9 18.5 9C18.33 9 18.16 9.02 18 9.05V5H7V19H15.05C15.02 19.16 15 19.33 15 19.5C15 19.67 15.02 19.84 15.05 20H7C5.9 20 5 19.1 5 19Z" fill="currentColor"/>
    </svg>
  );

  const PublicIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 11.05 4.18 10.14 4.5 9.3C5.64 10.47 7.18 11.25 8.9 11.25C9.32 11.25 9.73 11.2 10.13 11.1C9.4 11.68 8.88 12.5 8.88 13.5C8.88 14.95 10.05 16.13 11.5 16.13C11.81 16.13 12.11 16.07 12.38 15.97C12.29 16.36 12.24 16.76 12.24 17.18C12.24 18.67 13.05 19.95 14.18 20.68C13.52 19.98 12.8 19.34 12 18.78C11.2 19.34 10.48 19.98 9.82 20.68C9.28 20.33 8.81 19.89 8.42 19.38C8.93 18.96 9.28 18.37 9.28 17.68C9.28 16.4 8.26 15.38 6.98 15.38C6.75 15.38 6.52 15.41 6.3 15.47C5.41 13.87 5 12 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19V20ZM17 13.5C17 14.6 16.1 15.5 15 15.5C13.9 15.5 13 14.6 13 13.5C13 12.4 13.9 11.5 15 11.5C16.1 11.5 17 12.4 17 13.5Z" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="research-page">
      {/* Hero Section */}
      <section className="research-hero" ref={addToRefs}>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">Policy Research</span>
            <span className="title-line">Made Accessible</span>
          </h1>
          <p className="hero-subtitle" style={{ color: "beige" }}>
            Find verified quotes, understand policy context, and track legislative evolution
            through our comprehensive research tool.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section section-padding" ref={addToRefs}>
        <div className="container">
          <div className="section-header">
            <h2>What can I help you with today?</h2>
            <div className="accent-line"></div>
          </div>

          <div className="user-type-toggle">
            <button 
              className={userType === 'layperson' ? 'active' : ''}
              onClick={() => setUserType('layperson')}
            >
              <PublicIcon />
              General Public View
            </button>
            <button 
              className={userType === 'lawyer' ? 'active' : ''}
              onClick={() => setUserType('lawyer')}
            >
              <LawyerIcon />
              Legal Professional View
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="research-form">
            <div className="input-group">
              <div className="search-container">
                <SearchIcon />
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your question about any policy area or ministerial statement..."
                  rows={3}
                />
              </div>
            </div>
            
            <button type="submit" className="cta-button primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Researching...
                </>
              ) : (
                'Find Answers'
              )}
            </button>
          </form>
        </div>
      </section>

      {results && (
        <div className="results-section section-padding" ref={addToRefs}>
          <div className="container">
            <div className="section-header">
              <h2>Research Results</h2>
              <div className="accent-line"></div>
            </div>
            
            {userType === 'lawyer' ? (
              <div className="lawyer-results">
                <h3>Verified Quotes</h3>
                <div className="quotes-grid">
                  {results.quotes.map((quote: any) => (
                    <div key={quote.id} className="quote-card">
                      <div className="quote-text">"{quote.text}"</div>
                      <div className="quote-meta">
                        <div className="quote-source">
                          <strong>Source:</strong> {quote.source}
                        </div>
                        <div className="quote-date">
                          <strong>Date:</strong> {quote.date}
                        </div>
                        <div className="quote-link">
                          <a href={quote.url} target="_blank" rel="noopener noreferrer" className="source-link">
                            View original source
                          </a>
                        </div>
                        <div className="quote-reliability">
                          <strong>Reliability Rating:</strong>
                          {renderReliabilityIndicator(quote.reliability)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="layperson-results">
                <h3>Policy Summary</h3>
                <div className="summary-card">
                  <p>{results.summary}</p>
                  <div className="sources-section">
                    <h4>Verified Sources:</h4>
                    <ul>
                      {results.quotes.map((quote: any) => (
                        <li key={quote.id}>
                          <a href={quote.url} target="_blank" rel="noopener noreferrer" className="source-link">
                            {quote.source} ({quote.date})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="timeline-section">
              <h3>Policy Evolution Timeline</h3>
              <div className="timeline">
                {results.timeline.map((item: any, index: number) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-date">{item.date}</div>
                      <div className="timeline-policy">{item.policy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Research;