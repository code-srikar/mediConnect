import React, { useState } from 'react';
import { ChevronRight, Mail, Lock, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    otherSpec: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showOtherSpec, setShowOtherSpec] = useState(false);

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'General Physician',
    'Psychiatry',
    'Radiology'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'specialization' && value === 'Others') {
      setShowOtherSpec(true);
    } else if (name === 'specialization') {
      setShowOtherSpec(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      window.dispatchEvent(new CustomEvent('notify', { detail: { message: 'Passwords do not match!', type: 'error' } }));
      return;
    }

    if (formData.mobile.length !== 10 || !/^[0-9]+$/.test(formData.mobile)) {
      window.dispatchEvent(new CustomEvent('notify', { detail: { message: 'Cross-check your mobile number!', type: 'error' } }));
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/.test(formData.password)) {
      window.dispatchEvent(new CustomEvent('notify', { detail: { message: 'Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character', type: 'error' } }));
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/doctor/signup', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201 || response.status === 200) {
        window.dispatchEvent(new CustomEvent('notify', { detail: { message: '🎉 Signup successful!', type: 'success' } }));
        setFormData({
          name: '',
          specialization: '',
          otherSpec: '',
          mobile: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        navigate('/doctor/dlogin');
      } else {
        window.dispatchEvent(new CustomEvent('notify', { detail: { message: response.data.error || '⚠️ Signup failed. Please try again.', type: 'error' } }));
      }
    } catch (error) {
      console.error('Error during signup:', error);
      window.dispatchEvent(new CustomEvent('notify', { detail: { message: `Error: ${error.response?.data?.message || error.message}`, type: 'error' } }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">mediConnect</span>
            </div>
            <button
              onClick={() => navigate('/doctor/dlogin')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Login <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Join mediConnect</h2>
            <p className="mt-2 text-gray-600">Create your doctor account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative flex items-center">
                <User className="absolute ml-1 mb-2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="  Full Name"
                  className="pl-10 w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Specialization
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                  <option value="Others">Others</option>
                </select>
              </div>

              {showOtherSpec && (
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="otherSpec"
                    value={formData.otherSpec}
                    onChange={handleChange}
                    placeholder="Enter Specialization"
                    className="w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              )}

              <div className="relative flex items-center">
                <Phone className="absolute ml-1 mb-2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="  Mobile Number"
                  className="pl-10 w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="relative flex items-center">
                <Mail className="absolute ml-1 mb-2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="  Email Address"
                  className="pl-10 w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="relative flex items-center">
                <Lock className="absolute ml-1 mb-2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="  Password"
                  className="pl-10 w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="relative flex items-center">
                <Lock className="absolute ml-1 mb-2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="  Confirm Password"
                  className="pl-10 w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
