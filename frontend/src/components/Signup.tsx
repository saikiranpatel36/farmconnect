import { ChangeEvent, FocusEvent, FormEvent, KeyboardEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../services/authService';

const EMAIL_PATTERN = /^[a-zA-Z0-9]+@([\w-]+\.)+[\w-]{2,4}$/;
const MOBILE_PATTERN = /^\d{10}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface SignupForm {
  userName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  role: string;
}

type SignupTouched = Partial<Record<keyof SignupForm, boolean>>;

const EMPTY_FORM: SignupForm = {
  userName: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  role: ''
};

// same PASSWORD_PATTERN regex is duplicated on the backend in userController.
// not great, could export it from a shared file if this were a bigger project
function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<SignupTouched>({});
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateNumber = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const errors: Record<keyof SignupForm, boolean> = {
    userName: !form.userName,
    email: !EMAIL_PATTERN.test(form.email),
    mobile: !MOBILE_PATTERN.test(form.mobile),
    password: !PASSWORD_PATTERN.test(form.password),
    confirmPassword: !form.confirmPassword,
    role: !form.role
  };
  const mismatch = form.confirmPassword !== form.password;
  const formValid = !Object.values(errors).some(Boolean) && !mismatch;

  const passwordChecks = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[@$!%*?&]/.test(form.password)
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValid) {
      try {
        const response = await registerUser(form);
        setSuccessMessage(response.data.message);
        localStorage.setItem('currentuserFarm', JSON.stringify(form));
        setShowModal(true);
      } catch (err) {
        toast.error(
          'The email you entered is already registered. Please use a different email or try logging in instead.'
        );
        console.error('Signup failed', err);
        setShowModal(false);
      }
    } else {
      setTouched({
        userName: true,
        email: true,
        mobile: true,
        password: true,
        confirmPassword: true,
        role: true
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (successMessage === 'Success') {
      navigate('/login');
    }
  };

  return (
    <div className="signup-page container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center py-5">
      <div className="signup-brand text-center mb-4">
        <div className="brand-icon-circle mb-2">
          <i className="bi bi-flower1"></i>
        </div>
        <h1 className="signup-brand-title">FarmConnect</h1>
        <p className="signup-brand-subtitle">Connecting Livestock Owners with Feed Sellers</p>
      </div>

      <div className="col-11 col-md-7 col-lg-5">
        <div className="card shadow-lg p-4 p-md-5">
          <h2 className="text-center mb-4">Create Account</h2>
          <form onSubmit={onSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="userName">
                User Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="userName"
                placeholder="Username"
                id="userName"
                value={form.userName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.userName && errors.userName && (
                <div className="text-danger small mt-1">User Name is required.</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Email"
                id="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <div className="text-danger small mt-1">Valid email is required.</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="mobile">
                Mobile Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                className="form-control"
                name="mobile"
                maxLength={10}
                pattern="[0-9]{10}"
                onKeyPress={validateNumber}
                placeholder="Mobile"
                id="mobile"
                value={form.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.mobile && errors.mobile && (
                <div className="text-danger small mt-1">Valid 10-digit Mobile Number is required.</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
              {touched.password && errors.password && (
                <div className="text-danger small mt-1">Password does not meet the required constraints.</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="cpassword">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  id="cpassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
              {touched.confirmPassword && mismatch && (
                <div className="text-danger small mt-1">Passwords must match.</div>
              )}
            </div>

            <ul className="password-requirements mb-4">
              <li className={passwordChecks.length ? 'met' : ''}>
                <i className={`bi ${passwordChecks.length ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                At least 8 characters
              </li>
              <li className={passwordChecks.upper ? 'met' : ''}>
                <i className={`bi ${passwordChecks.upper ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                One uppercase letter
              </li>
              <li className={passwordChecks.lower ? 'met' : ''}>
                <i className={`bi ${passwordChecks.lower ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                One lowercase letter
              </li>
              <li className={passwordChecks.number ? 'met' : ''}>
                <i className={`bi ${passwordChecks.number ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                One number
              </li>
              <li className={passwordChecks.special ? 'met' : ''}>
                <i className={`bi ${passwordChecks.special ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                One special character (@ $ ! % * ? &amp;)
              </li>
            </ul>

            <div className="mb-4">
              <label className="form-label" htmlFor="role">
                Role <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                name="role"
                id="role"
                value={form.role}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="user">Owner</option>
                <option value="admin">Supplier</option>
              </select>
              {touched.role && errors.role && <div className="text-danger small mt-1">Role is required.</div>}
            </div>
            <button type="submit" className="btn btn-success w-100 fw-bold">
              Signup
            </button>
          </form>
          <p className="text-center mt-3 mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-success fw-bold text-decoration-none">
              Login
            </Link>
          </p>
        </div>
      </div>

      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        style={{ display: showModal ? 'block' : 'none' }}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center">
            <div className="modal-body">
              <h4>User Registration Successful</h4>
            </div>
            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-success" onClick={closeModal}>
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default Signup;
