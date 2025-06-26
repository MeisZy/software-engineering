import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewPass.css';

function NewPass() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (!password || !confirmPassword) {
      setError('Both password fields are required');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Password validation: at least 2 special characters and at least 1 number
    const specialCharCount = (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;
    if (specialCharCount < 2 || numberCount < 1) {
      setError('Password must contain at least 2 special characters and 1 number');
      setIsLoading(false);
      return;
    }

    const resetToken = localStorage.getItem('resetToken');
    const email = localStorage.getItem('resetEmail');

    if (!resetToken || !email) {
      setError('Invalid or expired reset session. Please start over.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/reset-password', {
        email,
        password,
        resetToken
      });
      setMessage(response.data.message);
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetToken');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      setIsLoading(false);
    }
  };

  return (
    <>
      <nav>
        <h2>Collectius</h2>
      </nav>
      <div className='proper'>
        <p>New Password</p>
        <div className='container'>
          {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
          {message && <p style={{ color: 'green', fontSize: '12px' }}>{message}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Set Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewPass;