import { ChangeEvent, FocusEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import OwnerNavbar from './OwnerNavbar';
import { addLivestock, getLivestockById, updateLivestock } from '../services/livestockService';
import { VaccinationStatus } from '../types/models';

interface LivestockFormField {
  name: 'name' | 'species' | 'age' | 'breed' | 'healthCondition' | 'location';
  label: string;
  type: 'text' | 'number';
}

const FIELDS: LivestockFormField[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'species', label: 'Species', type: 'text' },
  { name: 'age', label: 'Age', type: 'number' },
  { name: 'breed', label: 'Breed', type: 'text' },
  { name: 'healthCondition', label: 'Health Condition', type: 'text' },
  { name: 'location', label: 'Location', type: 'text' }
];

const VACCINATION_OPTIONS: VaccinationStatus[] = ['Vaccinated', 'Not Vaccinated', 'Up to date'];

interface LivestockFormState {
  name: string;
  species: string;
  age: string | number;
  breed: string;
  healthCondition: string;
  location: string;
  vaccinationStatus: VaccinationStatus;
}

const EMPTY_FORM: LivestockFormState = {
  name: '',
  species: '',
  age: '',
  breed: '',
  healthCondition: '',
  location: '',
  vaccinationStatus: ''
};

type FieldName = LivestockFormField['name'] | 'vaccinationStatus';

// doing validation manually here instead of a form library, gets a bit repetitive
// across this file + AddFeed.tsx + Signup.tsx. could probably pull this into a
// custom useForm hook at some point but works fine for now
function LivestockForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = Boolean(id);

  const [form, setForm] = useState<LivestockFormState>(EMPTY_FORM);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileTouched, setFileTouched] = useState(false);
  const [fileRequired, setFileRequired] = useState(false);

  useEffect(() => {
    if (editMode && id) {
      getLivestockById(id).then((res) => {
        const livestock = res.data;
        setForm({
          name: livestock.name,
          species: livestock.species,
          breed: livestock.breed,
          age: livestock.age,
          healthCondition: livestock.healthCondition,
          location: livestock.location,
          vaccinationStatus: livestock.vaccinationStatus
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isInvalid = (name: FieldName) => {
    if (!touched[name]) return false;
    if (name === 'age') return form.age === '' || Number(form.age) < 0;
    return !form[name as keyof LivestockFormState];
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target as { name: FieldName };
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileTouched(true);
    const file = e.target.files?.[0] ?? null;
    setAttachment(file);
    setFileRequired(!file);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFileTouched(true);
    const missingFile = !attachment && !editMode;
    if (missingFile) setFileRequired(true);

    const allTouched: Partial<Record<FieldName, boolean>> = {};
    FIELDS.forEach((f) => (allTouched[f.name] = true));
    allTouched.vaccinationStatus = true;
    setTouched(allTouched);

    const invalid =
      FIELDS.some((f) => (f.name === 'age' ? form.age === '' || Number(form.age) < 0 : !form[f.name])) ||
      !form.vaccinationStatus ||
      missingFile;

    if (invalid) return;

    const formData = new FormData();
    (Object.keys(form) as (keyof LivestockFormState)[]).forEach((key) =>
      formData.append(key, String(form[key]))
    );
    if (attachment) {
      formData.append('attachment', attachment);
    }
    const userId = localStorage.getItem('userId') || '';
    formData.append('userId', userId);

    if (editMode && id) {
      await updateLivestock(id, formData);
      toast.success('Livestock Updated Successfully');
      navigate('/owner/view-livestock');
    } else {
      await addLivestock(formData);
      toast.success('Livestock Added Successfully');
      navigate('/owner/view-livestock');
    }

    setForm(EMPTY_FORM);
    setAttachment(null);
    setFileRequired(false);
    setFileTouched(false);
  };

  const goBack = () => navigate('/owner/view-livestock');

  return (
    <>
      <OwnerNavbar />
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card p-4 shadow" style={{ width: 400 }}>
          <div className="d-flex justify-content-end">
            {editMode && (
              <button onClick={goBack} className="btn btn-primary mb-3" type="button">
                Back
              </button>
            )}
          </div>
          <form onSubmit={onSubmit} encType="multipart/form-data" noValidate>
            <h2 className="text-center mb-4">{editMode ? 'Edit Livestock' : 'Add New Livestock'}</h2>

            {FIELDS.map((field) => (
              <div className="form-group mb-4" key={field.name}>
                <label className="form-label w-100 text-center fw-semibold">
                  {field.label}{' '}
                  {field.name === 'age' && <small className="text-muted">(In-Years)</small>}
                  <span className="text-danger">*</span>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-control border-0 border-bottom border-3 rounded-0 text-center ${
                      isInvalid(field.name) ? 'is-invalid' : ''
                    }`}
                  />
                </label>
                {isInvalid(field.name) && (
                  <div className="text-danger text-center small mt-1">{field.label} is required</div>
                )}
              </div>
            ))}

            <div className="form-group mb-4">
              <label className="form-label w-100 text-center fw-semibold">
                Vaccination Status <span className="text-danger">*</span>
                <select
                  name="vaccinationStatus"
                  value={form.vaccinationStatus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control border-0 border-bottom border-3 rounded-0 text-center ${
                    isInvalid('vaccinationStatus') ? 'is-invalid' : ''
                  }`}
                >
                  <option value="" disabled>Select</option>
                  {VACCINATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              {isInvalid('vaccinationStatus') && (
                <div className="text-danger text-center small mt-1">Vaccination Status is required</div>
              )}
            </div>

            <div className="form-group mb-4">
              <label className="form-label w-100 text-center fw-semibold">
                Attachment <span className="text-danger">*</span>
                <input
                  type="file"
                  className="form-control border-0 border-bottom border-3 rounded-0 text-center"
                  onChange={onFileChange}
                  name="attachment"
                />
              </label>
              {fileTouched && fileRequired && (
                <div className="text-danger text-center small mt-1">Attachment is required</div>
              )}
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-success px-4">
                {editMode ? 'Update Livestock' : 'Add Livestock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LivestockForm;
