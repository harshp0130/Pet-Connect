import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import './Careers.css';

const Careers = () => {
  const [activeTab, setActiveTab] = useState('all');

  const jobOpenings = [
    { 
      id: 1, 
      title: "Frontend Developer", 
      department: "Engineering", 
      type: "Full-time", 
      location: "Remote",
      description: "We're looking for a skilled Frontend Developer to help build our pet care platform."
    },
    { 
      id: 2, 
      title: "Pet Care Specialist", 
      department: "Operations", 
      type: "Part-time", 
      location: "New York",
      description: "Join our team to help ensure quality standards for pet caregivers."
    },
    { 
      id: 3, 
      title: "Customer Support", 
      department: "Support", 
      type: "Full-time", 
      location: "Remote",
      description: "Help pet owners and caregivers have the best experience possible."
    },
  ];

  return (
    <div className="careers-page">
      {/* Header */}
      <header className="careers-header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <PawPrint className="logo-icon" />
              <span>PetConnect</span>
            </Link>
            <nav className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/careers" className="active">Careers</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="careers-hero animate-fadeIn">
        <div className="container">
          <h1>Join Our Pack</h1>
          <p>Help us connect pets with loving caregivers around the world</p>
        </div>
      </section>

      {/* Job Openings */}
      <section className="job-openings animate-slideUp">
        <div className="container">
          <div className="job-filters">
            <button 
              className={activeTab === 'all' ? 'active' : ''}
              onClick={() => setActiveTab('all')}
            >
              All Positions
            </button>
            <button 
              className={activeTab === 'engineering' ? 'active' : ''}
              onClick={() => setActiveTab('engineering')}
            >
              Engineering
            </button>
            <button 
              className={activeTab === 'operations' ? 'active' : ''}
              onClick={() => setActiveTab('operations')}
            >
              Operations
            </button>
            <button 
              className={activeTab === 'support' ? 'active' : ''}
              onClick={() => setActiveTab('support')}
            >
              Support
            </button>
          </div>

          <div className="jobs-list">
            {jobOpenings
              .filter(job => activeTab === 'all' || job.department.toLowerCase() === activeTab)
              .map(job => (
                <div key={job.id} className="job-card">
                  <h3>{job.title}</h3>
                  <div className="job-meta">
                    <span>{job.department}</span>
                    <span>{job.type}</span>
                    <span>{job.location}</span>
                  </div>
                  <p className="job-description">{job.description}</p>
                  <Link to={`/careers/${job.id}`} className="apply-btn">Apply Now</Link>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2>Why Join PetConnect?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <PawPrint size={24} />
              </div>
              <h3>Pet-Friendly Office</h3>
              <p>Bring your furry friend to work in our pet-friendly workspace.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <PawPrint size={24} />
              </div>
              <h3>Flexible Work</h3>
              <p>Remote and flexible work options for better work-life balance.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <PawPrint size={24} />
              </div>
              <h3>Growth Opportunities</h3>
              <p>We invest in your professional development and career growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="careers-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <PawPrint className="footer-logo-icon" />
              <span>PetConnect</span>
            </div>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} PetConnect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Careers;