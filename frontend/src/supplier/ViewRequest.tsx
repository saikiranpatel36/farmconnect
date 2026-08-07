import { ChangeEvent, useEffect, useState } from 'react';
import SupplierNavbar from './SupplierNavbar';
import { getAllRequests, updateRequest } from '../services/requestService';
import { Feed, FeedRequest, Livestock, User } from '../types/models';

const ITEMS_PER_PAGE = 5;

// same client-side pagination approach as MyRequest.tsx on the owner side
function ViewRequest() {
  const [requests, setRequests] = useState<FeedRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<FeedRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reason, setReason] = useState('');
  const [requestIdToReject, setRequestIdToReject] = useState('');
  const [showReasonModal, setShowReasonModal] = useState(false);

  const fetchRequests = () => {
    getAllRequests()
      .then((res) => {
        setRequests(res.data);
        setFilteredRequests(res.data);
      })
      .catch((err) => console.error('Error fetching requests:', err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    setFilteredRequests(
      requests.filter((request) =>
        (request.feedId as Feed)?.feedName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setCurrentPage(1);
  }, [searchQuery, requests]);

  const totalPages = Math.max(Math.ceil(filteredRequests.length / ITEMS_PER_PAGE), 1);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const updateRequestStatus = (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    updateRequest(requestId, { status })
      .then(() => fetchRequests())
      .catch((err) => console.error('Error updating request:', err));
  };

  const setRequestIdAndOpen = (requestId: string) => {
    setRequestIdToReject(requestId);
    setShowReasonModal(true);
  };

  const onReason = () => {
    if (!requestIdToReject || !reason) {
      console.error('Missing request ID or reason!');
      return;
    }
    updateRequest(requestIdToReject, { status: 'REJECTED', reason })
      .then(() => {
        fetchRequests();
        setRequestIdToReject('');
        setReason('');
        setShowReasonModal(false);
      })
      .catch((err) => console.error('Error updating request:', err));
  };

  return (
    <>
      <SupplierNavbar />
      <div className="p-4">
        <h1 className="mb-4 text-center">Requests</h1>
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
              <th>User Name</th>
              <th>Livestock Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Request Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.map((request, i) => (
              <tr key={request._id}>
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                <td>{(request.feedId as Feed)?.feedName || 'N/A'}</td>
                <td>{(request.userId as User)?.userName || 'N/A'}</td>
                <td>{(request.livestockId as Livestock)?.name || 'N/A'}</td>
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
                <td>
                  {(request.status === 'PENDING' || request.status === 'REJECTED') && (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => updateRequestStatus(request._id, 'APPROVED')}
                    >
                      Approve
                    </button>
                  )}
                  {(request.status === 'PENDING' || request.status === 'APPROVED') && (
                    <button className="btn btn-danger btn-sm" onClick={() => setRequestIdAndOpen(request._id)}>
                      Reject
                    </button>
                  )}
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

        <div
          className={`modal fade ${showReasonModal ? 'show' : ''}`}
          style={{ display: showReasonModal ? 'block' : 'none' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Reason</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReasonModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  name="reason"
                  id="reason"
                  className="form-control"
                  value={reason}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                  placeholder="Write a reason here.."
                  cols={5}
                  rows={5}
                  required
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={onReason}>Submit</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowReasonModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {showReasonModal && <div className="modal-backdrop fade show"></div>}
      </div>
    </>
  );
}

export default ViewRequest;
