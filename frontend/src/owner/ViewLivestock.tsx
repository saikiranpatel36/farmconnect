import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerNavbar from './OwnerNavbar';
import { deleteLivestock, getFileByLivestockId, getLivestockByUserId } from '../services/livestockService';
import { Livestock } from '../types/models';

const ITEMS_PER_PAGE = 3;

function ViewLivestock() {
  const navigate = useNavigate();
  const [livestocks, setLivestocks] = useState<Livestock[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [livestockToDelete, setLivestockToDelete] = useState<Livestock | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const fetchLivestocks = () => {
    const userId = localStorage.getItem('userId') || '';
    getLivestockByUserId(userId).then((res) => setLivestocks(res.data));
  };

  useEffect(() => {
    fetchLivestocks();
  }, []);

  const filteredLivestocks = useMemo(
    () => livestocks.filter((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [livestocks, searchQuery]
  );

  const totalPages = Math.max(Math.ceil(filteredLivestocks.length / ITEMS_PER_PAGE), 1);
  const paginatedLivestocks = filteredLivestocks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const confirmDelete = (livestock: Livestock) => {
    setLivestockToDelete(livestock);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setLivestockToDelete(null);
  };
  const handleDelete = () => {
    if (livestockToDelete) {
      deleteLivestock(livestockToDelete._id).then(() => {
        setLivestocks((prev) => prev.filter((l) => l !== livestockToDelete));
        closeModal();
        setImageUrl('');
      });
    }
  };

  const editLivestock = (id: string) => {
    navigate(`/owner/livestock-form/${id}`);
  };

  const viewAttachment = async (id: string) => {
    const url = await getFileByLivestockId(id);
    setImageUrl(url);
    setShowImageModal(true);
  };

  return (
    <>
      <OwnerNavbar />
      <div className="p-4">
        <h1 className="mb-4 text-center">Livestocks</h1>
        <input
          type="text"
          id="searchInput"
          className="form-control form-control-sm mb-3 custom-search"
          placeholder="Search by Name..."
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
              <th>Name</th>
              <th>Species</th>
              <th>Age</th>
              <th>Breed</th>
              <th>Health Condition</th>
              <th>Location</th>
              <th>Vaccination Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLivestocks.map((livestock, i) => (
              <tr key={livestock._id}>
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                <td>{livestock.name}</td>
                <td>{livestock.species}</td>
                <td>{livestock.age}</td>
                <td>{livestock.breed}</td>
                <td>{livestock.healthCondition}</td>
                <td>{livestock.location}</td>
                <td>{livestock.vaccinationStatus}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => editLivestock(livestock._id)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => confirmDelete(livestock)}>
                    Delete
                  </button>
                  <button className="btn btn-success btn-sm" onClick={() => viewAttachment(livestock._id)}>
                    View Attachment
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
              <div className="custom-modal-body">Are you sure you want to delete this livestock?</div>
              <div className="custom-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

        <div
          className={`modal fade ${showImageModal ? 'show' : ''}`}
          style={{ display: showImageModal ? 'block' : 'none' }}
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <img id="modalImage" src={imageUrl} className="img-fluid" alt="Attachment of Livestock" />
              </div>
              <div className="modal-footer justify-content-center">
                <button type="button" className="btn btn-secondary" onClick={() => setShowImageModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {showImageModal && <div className="modal-backdrop fade show"></div>}
      </div>
    </>
  );
}

export default ViewLivestock;
