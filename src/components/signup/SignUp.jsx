import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import { AuthContext } from '../../context/AuthContextValue';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignUp() {
  const { signup, isAuthenticated, isSubmitting } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = ({ target }) => {
    setFormData((current) => ({
      ...current,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      navigate('/', { replace: true });
    } catch (submitError) {
      setError(submitError.message || 'Unable to create your account.');
    }
  };

  return (
    <section className='auth-shell'>
      <div className='auth-panel auth-copy'>
        <p className='auth-kicker'>Start trading smarter</p>
        <h1>Create your CryptoPlace account in minutes.</h1>
        <p>
          Use your email and password to create a secure account and unlock protected market detail
          pages across the app.
        </p>
      </div>

      <form className='auth-panel auth-card' onSubmit={handleSubmit}>
        <h2>Create account</h2>
        <p className='subtitle'>Set up secure email and password access</p>

        {error ? <div className='form-alert error-alert'>{error}</div> : null}

        <div className='field'>
          <label htmlFor='signup-name'>Full name</label>
          <input
            id='signup-name'
            name='name'
            type='text'
            placeholder='John Doe'
            autoComplete='name'
            value={formData.name}
            onChange={handleChange}
            minLength={2}
            required
          />
        </div>

        <div className='field'>
          <label htmlFor='signup-email'>Email</label>
          <input
            id='signup-email'
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
          <label htmlFor='signup-password'>Password</label>
          <input
            id='signup-password'
            name='password'
            type='password'
            placeholder='Create a secure password'
            autoComplete='new-password'
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />
        </div>

        <div className='field'>
          <label htmlFor='signup-confirm-password'>Confirm password</label>
          <input
            id='signup-confirm-password'
            name='confirmPassword'
            type='password'
            placeholder='Repeat your password'
            autoComplete='new-password'
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength={8}
            required
          />
        </div>

        <button type='submit' className='auth-btn' disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>

        <p className='switch-link'>
          Already have an account?{' '}
          <Link to='/signin'>
            <span>Sign in</span>
          </Link>
        </p>
      </form>
    </section>
  );
}
