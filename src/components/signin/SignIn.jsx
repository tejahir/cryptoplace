import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SignIn.css';
import { AuthContext } from '../../context/AuthContextValue';

const initialForm = {
  email: '',
  password: '',
};

export default function SignIn() {
  const { login, isAuthenticated, isSubmitting } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleChange = ({ target }) => {
    setFormData((current) => ({
      ...current,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message || 'Unable to sign in.');
    }
  };

  return (
    <section className='auth-shell'>
      <div className='auth-panel auth-copy'>
        <p className='auth-kicker'>CryptoPlace access</p>
        <h1>Welcome back to your market dashboard.</h1>
        <p>
          Sign in with your email and password to continue tracking coins, price movements, and
          detailed market insights.
        </p>
      </div>

      <form className='auth-panel auth-card' onSubmit={handleSubmit}>
        <h2>Sign in</h2>
        <p className='subtitle'>Securely access your account</p>

        {error ? <div className='form-alert error-alert'>{error}</div> : null}

        <div className='field'>
          <label htmlFor='signin-email'>Email</label>
          <input
            id='signin-email'
            name='email'
            type='email'
            placeholder='you@example.com'
            autoComplete='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className='field'>
          <label htmlFor='signin-password'>Password</label>
          <input
            id='signin-password'
            name='password'
            type='password'
            placeholder='Enter your password'
            autoComplete='current-password'
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />
        </div>

        <div className='extra'>
          <span className='security-note'>Email + password authentication only</span>
        </div>

        <button type='submit' className='auth-btn' disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        <p className='switch-link'>
          Don&apos;t have an account?{' '}
          <Link to='/signup'>
            <span>Create one</span>
          </Link>
        </p>
      </form>
    </section>
  );
}
