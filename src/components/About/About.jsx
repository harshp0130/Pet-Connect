import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import './About.css';

const About = () => {
  useEffect(() => {
    document.title = "About PetConnect | Connecting Pet Owners with Caregivers";
  }, []);

  return (
    <div className="about-page">
      {/* Header */}
      <header className="about-header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <PawPrint className="logo-icon" />
              <span>PetConnect</span>
            </Link>
            <nav className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/about" className="active">About</Link>
              <Link to="/services">Services</Link>
              <Link to="/contact">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="about-hero animate-fadeIn">
        <div className="container">
          <h1>Our Story</h1>
          <p className="subtitle">Connecting pet owners with trusted caregivers since 2025</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section animate-slideUp">
        <div className="container">
          <h2>Our Mission</h2>
          <p>
            At PetConnect, we believe every pet deserves loving care when their owners are away. 
            We've created a platform that makes finding trusted pet caregivers simple, safe, and reliable.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section animate-slideUp">
        <div className="container">
          <h2>Meet the Team</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <p>{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
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

const teamMembers = [
  { id: 1, name: "RohitKumar", position: "Founder & CEO", image: "/images/team1.jpg" },
  { id: 2, name: "Krish Kavathia", position: "Head of Operations", image: "/images/team2.jpg" },
  { id: 3, name: "Rishav Kumar", position: "Lead Developer", image: "/images/team3.jpg" },
  { id: 4, name: "Emma Davis", position: "Customer Success", image: "/images/team4.jpg" },
];

export default About;