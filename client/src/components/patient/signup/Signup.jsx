import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!', {
        position: 'top-center',
        className: 'custom-toast',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/patient/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('🎉 Signup successful!', {
          position: 'top-center',
          className: 'custom-toast',
        });

        setFormData({
          name: '',
          gender: '',
          mobile: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        toast.error(data.error || '⚠️ Signup failed. Please try again.', {
          position: 'top-center',
          className: 'custom-toast',
        });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: 'top-center',
        className: 'custom-toast',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/patient/login');
  }

  return (
    <div className="signup-page">
      <div className="navbar">
        <h3>mediConnect</h3>
        <div className="navbar-content ">
          <button onClick={handleLoginClick}>Login</button>
        </div>
      </div>
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h3 style={{ margintop: '8px' }}>Patient Signup</h3>

          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          /> */}

          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="mobile">Mobile</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmPassword">Re-enter Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Signup'}
          </button>

          {/* <div className="redirect-login">
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Login here
            </Link>
          </div> */}
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
