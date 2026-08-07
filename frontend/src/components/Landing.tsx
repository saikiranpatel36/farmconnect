import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark p-2">
        <a className="navbar-brand me-4" href="#">
          <i className="bi bi-flower1 me-2"></i>FarmConnect
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto text-center">
            <li className="nav-item">
              <Link className="btn btn-outline-light btn-sm mx-2 mt-2" to="/login">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <section className="hero-section">
        <div className="overlay-container">
          <div className="overlay-content">
            <div className="hero-text">
              <h1 className="hero-title">FarmConnect</h1>
              <p className="hero-tagline">Connecting Livestock Owners with Feed Sellers</p>
              <Link to="/signup" className="btn btn-success btn-lg mt-3">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container my-5">
        <h2 className="text-center mb-5">
          <i className="bi bi-lightbulb-fill blink"></i> About Us
        </h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100 hover-shadow about-card">
              <div className="card-body">
                <div className="about-icon"><i className="bi bi-flower2"></i></div>
                <h5 className="card-title">Our Farm</h5>
                <ul className="about-list">
                  <li>Sustainable and ethical farming practices</li>
                  <li>Healthy livestock raised with proper care</li>
                  <li>Focus on eco-friendly, organic production</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100 hover-shadow about-card">
              <div className="card-body">
                <div className="about-icon"><i className="bi bi-people-fill"></i></div>
                <h5 className="card-title">Our People</h5>
                <ul className="about-list">
                  <li>Dedicated veterinarians ensuring animal health</li>
                  <li>Committed suppliers and farm managers</li>
                  <li>Strong community support and collaboration</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100 hover-shadow about-card">
              <div className="card-body">
                <div className="about-icon"><i className="bi bi-cpu-fill"></i></div>
                <h5 className="card-title">Our Technology</h5>
                <ul className="about-list">
                  <li>Smart tools for precision agriculture</li>
                  <li>Data-driven decisions for better efficiency</li>
                  <li>Digital tracking for livestock and feed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 mission">
        <div className="container">
          <h2 className="text-center mb-5">Our Mission &amp; Vision</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-4 h-100">
                <h4 className="text-center mb-3">
                  <i className="bi bi-bullseye me-2"></i>Mission
                </h4>
                <ul className="mission-list">
                  <li>Promote ethical livestock farming</li>
                  <li>Empower rural communities</li>
                  <li>Ensure food sustainability</li>
                  <li>Encourage eco-friendly practices</li>
                  <li>Improve quality through technology</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-4 h-100">
                <h4 className="text-center mb-3">
                  <i className="bi bi-eye-fill me-2"></i>Vision
                </h4>
                <ul className="mission-list">
                  <li>Become a leader in sustainable agriculture</li>
                  <li>Advance modern farming techniques</li>
                  <li>Bridge the gap between farmers and suppliers</li>
                  <li>Expand our network across regions</li>
                  <li>Support research-driven farming practices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-light pt-5 pb-3">
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-center mb-3">
              <h5>FarmConnect</h5>
              <p className="text-secondary">Connecting farmers and suppliers, one request at a time.</p>
            </div>
            <div className="col-md-4 text-center mb-3">
              <h5>Navigation</h5>
              <ul className="list-unstyled">
                <li><a className="text-light" href="#">Home</a></li>
                <li><a className="text-light" href="#">Services</a></li>
                <li><a className="text-light" href="#">Contact</a></li>
              </ul>
            </div>
            <div className="col-md-4 text-center mb-3">
              <h5>Contact</h5>
              <p className="mb-1">+1 234 567 890</p>
              <p className="mb-0">info@farmconnect.com</p>
            </div>
          </div>
          <hr className="border-secondary" />
          <p className="text-center mb-0 text-secondary">&copy; 2025 FarmConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
