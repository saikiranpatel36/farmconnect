import { ChangeEvent, FocusEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../services/authService';

const EMAIL_PATTERN = /^[a-zA-Z0-9]+@([\w-]+\.)+[\w-]{2,4}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface LoginForm {
  email: string;
  password: string;
}

interface LoginTouched {
  email: boolean;
  password: boolean;
}

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [touched, setTouched] = useState<LoginTouched>({ email: false, password: false });

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentuserRole');
    localStorage.removeItem('username');

    const data = JSON.parse(localStorage.getItem('currentuserFarm') || 'null');
    if (data) {
      setForm((prev) => ({ ...prev, email: data.email }));
    }
  }, []);

  const emailInvalid = touched.email && !EMAIL_PATTERN.test(form.email);
  const passwordInvalid = touched.password && !PASSWORD_PATTERN.test(form.password);
  const formValid = EMAIL_PATTERN.test(form.email) && PASSWORD_PATTERN.test(form.password);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValid) {
      try {
        const response = await loginUser(form);
        const data = response.data;
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.username);
          localStorage.setItem('currentuserRole', data.role);
          localStorage.setItem('userId', data.id);
          localStorage.setItem('userEmail', form.email);
          localStorage.removeItem('currentuserFarm');
          toast.success('Login successful!');
          navigate('/home-page');
        } else {
          toast.error(data.message || 'Login failed');
        }
      } catch (err) {
        console.error('Login failed:', err);
        toast.error('Invalid Email and password');
      }
    } else {
      setTouched({ email: true, password: true });
      toast.warning('Please fill in valid details before submitting');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 container-fluid">
      <div className="row g-0 w-75">
        <div
          className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-4"
          style={{ background: 'linear-gradient(to right,#03e167,#03A791)' }}
        >
          <div className="brand-icon-circle mb-3">
            <i className="bi bi-flower1"></i>
          </div>
          <h1>FarmConnect</h1>
          <p className="text-center fs-4">Connecting Livestock Owners with Feed Sellers</p>
        </div>
        <div className="col-md-6 p-4" style={{ background: 'linear-gradient(to right, #077A7D, #03A791)' }}>
          <div className="card shadow-lg p-5 m-2">
            <h2 className="text-center">Login</h2>
            <form onSubmit={login} noValidate>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control p-2"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {emailInvalid && (
                  <div className="text-danger">Valid email is required.</div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  className="form-control bg-white p-2"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {passwordInvalid && (
                  <div className="text-danger">
                    Password must be 8+ characters with an uppercase letter, a lowercase letter, a number
                    and a special character.
                  </div>
                )}
              </div>
              <p className="text-center">
                <Link to="/forgot-password">Forgot Password?</Link>
              </p>
              <button type="submit" className="btn btn-success w-100 p-2 mt-2 fw-bold">
                Login
              </button>
            </form>
            <p className="text-center mt-3">
              Don't have an account?{' '}
              <Link to="/signup" className="text-success fw-bold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
