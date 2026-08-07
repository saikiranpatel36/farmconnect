import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SupplierNavbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem('username') || '');
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const confirmLogout = () => {
    setShowModal(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom p-3">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">FarmConnect</a>
          <button
            className="navbar-toggler bg-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button className="btn btn-supplier"> {userName} / Supplier</button>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/home-page">Home</Link>
              </li>
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle text-white fw-bold"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Feed
                </button>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li><Link className="dropdown-item" to="/supplier/add-feed">Add Feed</Link></li>
                  <li><Link className="dropdown-item" to="/supplier/view-feed">View Feed</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/supplier/view-request">View Requests</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-logout" onClick={openModal}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        style={{ display: showModal ? 'block' : 'none' }}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center">
            <div className="modal-header">
              <h5 className="modal-title">Logout Confirmation</h5>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
}

export default SupplierNavbar;
