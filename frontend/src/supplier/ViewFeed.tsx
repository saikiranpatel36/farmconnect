import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierNavbar from './SupplierNavbar';
import { deleteFeed, getAllFeeds } from '../services/feedService';
import { Feed } from '../types/models';

const ITEMS_PER_PAGE = 3;

function ViewFeed() {
  const navigate = useNavigate();
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [feedToDelete, setFeedToDelete] = useState<Feed | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadFeeds = () => {
    getAllFeeds()
      .then((res) => setFeeds(res.data))
      .catch((err) => console.error('Error fetching feeds', err));
  };

  useEffect(() => {
    loadFeeds();
  }, []);

  const filteredFeeds = useMemo(
    () => feeds.filter((feed) => feed.feedName.toLowerCase().includes(searchQuery.toLowerCase())),
    [feeds, searchQuery]
  );

  const totalPages = Math.max(Math.ceil(filteredFeeds.length / ITEMS_PER_PAGE), 1);
  const paginatedFeeds = filteredFeeds.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const confirmDelete = (feed: Feed) => {
    setFeedToDelete(feed);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setFeedToDelete(null);
  };
  const handleDelete = () => {
    if (feedToDelete) {
      deleteFeed(feedToDelete._id)
        .then(() => {
          setFeeds((prev) => prev.filter((feed) => feed !== feedToDelete));
          closeModal();
        })
        .catch((err) => console.error('Error deleting feed', err));
    }
  };

  const confirmUpdate = (id: string) => navigate(`/supplier/add-feed/${id}`);

  return (
    <>
      <SupplierNavbar />
      <div className="p-4">
        <h1 className="mb-4 text-center">Feeds</h1>
        <input
          type="text"
          id="searchInput"
          className="form-control form-control-sm mb-3 custom-search"
          placeholder="Search by Feed Name..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>SNo</th>
              <th>Feed Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>Unit</th>
              <th>Price Per Unit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFeeds.map((feed, i) => (
              <tr key={feed._id}>
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                <td>{feed.feedName}</td>
                <td>{feed.type}</td>
                <td>{feed.description}</td>
                <td>{feed.unit}</td>
                <td>{typeof feed.pricePerUnit === 'string' ? feed.pricePerUnit : feed.pricePerUnit?.$numberDecimal}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => confirmUpdate(feed._id)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(feed)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-controls text-center mt-3">
          <button onClick={prevPage} disabled={currentPage === 1}>Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
        </div>

        {showModal && (
          <div className="custom-modal">
            <div className="custom-modal-content">
              <div className="custom-modal-header">
                <h5>Confirm Delete</h5>
                <button type="button" className="close" onClick={closeModal}>&times;</button>
              </div>
              <div className="custom-modal-body">Are you sure you want to delete this feed?</div>
              <div className="custom-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ViewFeed;
