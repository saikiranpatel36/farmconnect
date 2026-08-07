import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { verifyEmail, resetPassword } from '../services/authService';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValid = PASSWORD_PATTERN.test(newPassword);

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailTouched(true);
    if (!email) return;
    try {
      const response = await verifyEmail(email);
      if (response.data.success === true) {
        setShowPasswordFields(true);
        setEmailVerified(true);
      } else {
        toast.error('Email not Exists');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordTouched(true);
    setConfirmTouched(true);

    if (!passwordValid) {
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await resetPassword(email, newPassword);
      toast.success('Password reset Successfull');
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow p-4 mt-5 w-50">
        <div className="row align-items-center">
          <div className="col-md-5 text-center forgot-password-illustration">
            <div className="illustration-circle">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <p className="text-muted mt-3 mb-0">Reset your account password securely</p>
          </div>
          <div className="col-md-7">
            <h2 className="text-center mb-4">Forgot Password</h2>
            <form onSubmit={handleVerify}>
              <div className="input-group mb-3">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="form-control"
                  required
                  disabled={emailVerified}
                />
                <button type="submit" className="btn btn-success" disabled={emailVerified}>
                  Verify
                </button>
              </div>
              {emailTouched && !email && <small className="text-danger">Email is required</small>}
            </form>
            {showPasswordFields && (
              <form onSubmit={handleReset} className="mt-3">
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={newPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                      className="form-control"
                      required
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
                  {passwordTouched && !passwordValid && (
                    <small className="text-danger">
                      Password must be at least 8 characters and include an uppercase letter, a lowercase
                      letter, a number and a special character.
                    </small>
                  )}
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="form-control"
                      required
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
                  {confirmTouched && confirmPassword !== newPassword && (
                    <small className="text-danger">Passwords do not match</small>
                  )}
                </div>
                <button type="submit" className="btn btn-danger w-100">
                  Reset Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
