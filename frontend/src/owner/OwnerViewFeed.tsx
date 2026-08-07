import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OwnerNavbar from './OwnerNavbar';
import { getAllFeeds } from '../services/feedService';
import { getLivestockByUserId } from '../services/livestockService';
import { addRequest } from '../services/requestService';
import { Feed, Livestock } from '../types/models';

const ITEMS_PER_PAGE = 5;

interface RequestFormState {
  quantity: string;
  livestockId: string;
  userId: string | null;
}

// using a plain div for the request modal instead of bootstrap's modal component,
// easier than dealing with the bootstrap JS + react conflicts
function OwnerViewFeed() {
  const navigate = useNavigate();
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [livestockList, setLivestockList] = useState<Livestock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState<RequestFormState>({ quantity: '', livestockId: '', userId: null });

  useEffect(() => {
    getAllFeeds()
      .then((res) => setFeeds(res.data))
      .catch((err) => console.error('Error fetching feeds:', err));

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage.');
      return;
    }
    getLivestockByUserId(userId)
      .then((res) => setLivestockList(res.data))
      .catch((err) => console.error('Error fetching livestock:', err));

    setRequestData((prev) => ({ ...prev, userId }));
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

  const openRequestForm = (feed: Feed) => {
    setSelectedFeed(feed);
    setShowRequestModal(true);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setSelectedFeed(null);
    setRequestData((prev) => ({ ...prev, quantity: '', livestockId: '' }));
  };

  const submitRequest = async () => {
    if (!requestData.quantity || !requestData.livestockId || !requestData.userId || !selectedFeed) {
      toast.error('Please select livestock, enter quantity, and ensure user ID is available.');
      return;
    }
    const requestPayload = {
      feedId: selectedFeed._id,
      livestockId: requestData.livestockId,
      userId: requestData.userId,
      quantity: requestData.quantity,
      status: 'PENDING' as const
    };
    try {
      await addRequest(requestPayload);
      toast.success('Request submitted successfully!');
      closeRequestModal();
      navigate('/owner/my-request');
    } catch (err) {
      console.error('Error submitting request:', err);
    }
  };

  return (
    <>
      <OwnerNavbar />
      <div className="p-4">
        <h1 className="mb-4 text-center">Available Feeds</h1>
        <input
          type="text"
          className="form-control form-control-sm mb-3 custom-search"
          placeholder="Search by Feed Name..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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
              <th>Actions</th>
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
                  <button className="btn btn-success btn-sm" onClick={() => openRequestForm(feed)}>
                    Request
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

        {showRequestModal && (
          <div className="custom-modal">
            <div className="custom-modal-content">
              <div className="custom-modal-header">
                <h5>Request Feed</h5>
                <button type="button" className="close" onClick={closeRequestModal}>&times;</button>
              </div>
              <div className="custom-modal-body">
                <label htmlFor="livestock">Select Livestock:</label>
                <select
                  className="form-control"
                  id="livestock"
                  required
                  value={requestData.livestockId}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setRequestData((prev) => ({ ...prev, livestockId: e.target.value }))}
                >
                  <option value="" disabled>Select Livestock</option>
                  {livestockList.map((livestock) => (
                    <option key={livestock._id} value={livestock._id}>
                      {livestock.breed} - {livestock.name}
                    </option>
                  ))}
                </select>
                <label className="mt-3" htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  required
                  value={requestData.quantity}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setRequestData((prev) => ({ ...prev, quantity: e.target.value }))}
                />
              </div>
              <div className="custom-modal-footer mt-3">
                <button type="button" className="btn btn-success" onClick={submitRequest}>Confirm Request</button>
                <button type="button" className="btn btn-success" onClick={closeRequestModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default OwnerViewFeed;
