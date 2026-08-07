import { useEffect, useState } from 'react';
import OwnerNavbar from '../owner/OwnerNavbar';
import SupplierNavbar from '../supplier/SupplierNavbar';

function HomePage() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem('currentuserRole'));
  }, []);

  return (
    <>
      {userRole === 'user' && <OwnerNavbar />}
      {userRole === 'admin' && <SupplierNavbar />}

      <section className="hero-section">
        <div className="overlay">
          <h1 className="hero-title text-center">FarmConnect</h1>
          <p className="hero-tagline text-center mt-3">Connecting Livestock Owners with Feed Sellers</p>
        </div>
      </section>

      <section className="about-us">
        <h2 className="section-title text-center mb-5">About FarmConnect</h2>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 about-card">
                <div className="card-body">
                  <div className="about-icon"><i className="bi bi-truck"></i></div>
                  <h5 className="card-title">Our Services</h5>
                  <ul className="about-list">
                    <li>Access to quality feed, medicine and farming supplies</li>
                    <li>Direct connection between farmers and trusted suppliers</li>
                    <li>Simple request and approval workflow for every order</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 about-card">
                <div className="card-body">
                  <div className="about-icon"><i className="bi bi-shop"></i></div>
                  <h5 className="card-title">Marketplace</h5>
                  <ul className="about-list">
                    <li>A single place to list and browse feed products</li>
                    <li>Competitive pricing set directly by suppliers</li>
                    <li>Order tracking from request to approval</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 about-card">
                <div className="card-body">
                  <div className="about-icon"><i className="bi bi-cpu"></i></div>
                  <h5 className="card-title">Technology</h5>
                  <ul className="about-list">
                    <li>Digital livestock records with vaccination tracking</li>
                    <li>Secure login and role-based dashboards</li>
                    <li>Real-time updates on feed request status</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-us">
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <div className="contact-logo-circle">
                <i className="bi bi-flower1"></i>
              </div>
              <h2 className="company-name mt-3">FarmConnect</h2>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <h4>Quick Links</h4>
              <ul className="nav-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Marketplace</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h4>Contact Us</h4>
              <ul className="contact-details">
                <li><i className="bi bi-geo-alt-fill"></i> Hyderabad, India</li>
                <li><i className="bi bi-envelope-fill"></i> support@farmconnect.com</li>
                <li><i className="bi bi-telephone-fill"></i> +91 98765 43210</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
