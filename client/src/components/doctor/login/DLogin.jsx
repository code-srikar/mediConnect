import React, { useState } from 'react';
import { Mail, Lock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { Heart, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
const Login = () => {
  const isScrolled = true;
  const auth = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {
      const result = await auth.doctorLoginAction(formData);
      console.log(result)
      if (result.ok) {
        setTimeout(() => {
          toast.success("Otp sent to your Email");
          navigate('/doctor/Verify', { state: { otp: result.otp, email: formData.email } });
        }, 2000);
      } else {
        toast.warning("Invalid login details");
      }
    } catch (error) {
      toast.warning(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-blue-900" onClick={() => navigate('/authpage')} style={{ cursor: 'pointer' }}>MediConnect</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/doctor/DSignup')}
              className="w-full flex items-center justify-center py-2 px-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              SignUp
              <ArrowRight className="ml-2 h-5 w-6" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back, Doctor</h2>
            <p className="mt-2 text-gray-600">Login to your account</p>
          </div>

          {/* Notification Section */}
          {/* {notification.message && (
            <div className={`mb-4 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {notification.message}
            </div>
          )} */}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
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

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-${loading ? '300' : '600'} hover:bg-indigo-${loading ? '400' : '700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-${loading ? '300' : '500'} disabled:opacity-${loading ? '50' : '100'} disabled:cursor-notallowed transition-colors duration-${loading ? '200' : '200'}`}
            >
              {loading ? 'Logging in...' : 'Log in'}
              <ArrowRight className="ml-2 h-5 w-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
