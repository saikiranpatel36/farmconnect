import { ChangeEvent, FocusEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SupplierNavbar from './SupplierNavbar';
import { addFeed, getFeedById, updateFeed } from '../services/feedService';

interface FeedFormField {
  name: 'feedName' | 'type' | 'description' | 'unit' | 'pricePerUnit';
  label: string;
  type: 'text' | 'number';
}

const FIELDS: FeedFormField[] = [
  { name: 'feedName', label: 'Feed Name', type: 'text' },
  { name: 'type', label: 'Type', type: 'text' },
  { name: 'description', label: 'Description', type: 'text' },
  { name: 'unit', label: 'Unit', type: 'text' },
  { name: 'pricePerUnit', label: 'Price Per Unit', type: 'number' }
];

interface FeedForm {
  feedName: string;
  type: string;
  description: string;
  unit: string;
  pricePerUnit: string;
}

const EMPTY_FORM: FeedForm = { feedName: '', type: '', description: '', unit: '', pricePerUnit: '' };

function AddFeed() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = Boolean(id);

  const [form, setForm] = useState<FeedForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<Partial<Record<keyof FeedForm, boolean>>>({});

  useEffect(() => {
    if (editMode && id) {
      getFeedById(id).then((res) => {
        const feed = res.data;
        const price = typeof feed.pricePerUnit === 'string' ? feed.pricePerUnit : feed.pricePerUnit.$numberDecimal;
        setForm({
          feedName: feed.feedName,
          type: feed.type,
          description: feed.description,
          unit: feed.unit,
          pricePerUnit: price
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const errors: Record<keyof FeedForm, boolean> = {
    feedName: !form.feedName,
    type: !form.type,
    description: !form.description || form.description.length < 6,
    unit: !form.unit,
    pricePerUnit: form.pricePerUnit === '' || Number(form.pricePerUnit) < 0
  };

  const isInvalid = (name: keyof FeedForm) => Boolean(touched[name]) && errors[name];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target as { name: keyof FeedForm };
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const goBack = () => navigate('/supplier/view-feed');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allTouched: Partial<Record<keyof FeedForm, boolean>> = {};
    FIELDS.forEach((f) => (allTouched[f.name] = true));
    setTouched(allTouched);

    if (Object.values(errors).some(Boolean)) return;

    const feedData = { ...form, pricePerUnit: form.pricePerUnit.toString() };

    if (editMode && id) {
      try {
        await updateFeed(id, feedData);
        toast.success('Feed updated successfully!');
        navigate('/supplier/view-feed');
      } catch (err) {
        console.error('Update failed:', err);
      }
    } else {
      try {
        await addFeed(feedData);
        toast.success('Feed Added successfully!');
        navigate('/supplier/view-feed');
      } catch (err) {
        toast.error('Add Failed');
        console.error('Add failed:', err);
      }
    }
  };

  return (
    <>
      <SupplierNavbar />
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card p-4 shadow" style={{ width: 400 }}>
          <div className="d-flex justify-content-end">
            {editMode && (
              <button onClick={goBack} className="btn btn-primary mb-3" type="button">
                Back
              </button>
            )}
          </div>
          <form onSubmit={onSubmit} noValidate>
            <h2 className="text-center mb-4">{editMode ? 'Edit Feed' : 'Add New Feed'}</h2>

            {FIELDS.map((field) => (
              <div className="form-group mb-4" key={field.name}>
                <label className="form-label w-100 text-center fw-semibold">
                  {field.label}{' '}
                  {field.name === 'unit' && <small className="text-muted">(e.g. kg)</small>}
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
                  <div className="text-danger text-center small mt-1">
                    {!form[field.name] && <span>{field.label} is required.</span>}
                    {field.name === 'description' && form.description && form.description.length < 6 && (
                      <span>Minimum 6 characters required.</span>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="text-center">
              <button type="submit" className="btn btn-success px-4">
                {editMode ? 'Update Feed' : 'Add Feed'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddFeed;
