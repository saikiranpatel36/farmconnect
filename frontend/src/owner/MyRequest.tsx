import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import OwnerNavbar from './OwnerNavbar';
import { deleteRequest, getRequestsByUserId } from '../services/requestService';
import { Feed, FeedRequest } from '../types/models';

const ITEMS_PER_PAGE = 5;

// pagination here is all client side (fetches everything then slices it), which is
// fine while there's only a handful of requests per user but won't scale well.
// should move this to a paginated API call if the data grows
function MyRequest() {
  const [requests, setRequests] = useState<FeedRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [requestToDelete, setRequestToDelete] = useState<FeedRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRequests = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found.');
      return;
    }
    getRequestsByUserId(userId)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error('Error fetching requests:', err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(
    () =>
      requests.filter((request) =>
        (request.feedId as Feed)?.feedName?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [requests, searchQuery]
  );

  const totalPages = Math.max(Math.ceil(filteredRequests.length / ITEMS_PER_PAGE), 1);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const confirmDelete = (request: FeedRequest) => {
    setRequestToDelete(request);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setRequestToDelete(null);
  };
  const handleDelete = () => {
    if (requestToDelete) {
      deleteRequest(requestToDelete._id)
        .then(() => {
          fetchRequests();
          closeModal();
        })
        .catch((err) => console.error('Error deleting request:', err));
    }
  };

  return (
    <>
      <OwnerNavbar />
      <div className="p-4">
        <h1 className="mb-4 text-center">My Requests</h1>
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
              <th>Quantity</th>
              <th>Status</th>
              <th>Request Date</th>
              <th>Reject Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.map((request, i) => (
              <tr key={request._id}>
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                <td>{(request.feedId as Feed)?.feedName}</td>
                <td>{request.quantity}</td>
                <td
                  className={
                    request.status === 'PENDING'
                      ? 'text-warning'
                      : request.status === 'APPROVED'
                      ? 'text-success'
                      : request.status === 'REJECTED'
                      ? 'text-danger'
                      : ''
                  }
                >
                  {request.status}
                </td>
                <td>{request.requestDate ? new Date(request.requestDate).toLocaleString() : ''}</td>
                {(request.status === 'PENDING' || request.status === 'APPROVED') && <td>N/A</td>}
                {request.status === 'REJECTED' && <td>{request.reason ? request.reason : 'N/A'}</td>}
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={request.status !== 'PENDING'}
                    onClick={() => confirmDelete(request)}
                  >
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
              <div className="custom-modal-body">Are you sure you want to delete this request?</div>
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

export default MyRequest;
