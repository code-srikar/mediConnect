import React, { useState } from 'react';
import { Mail, Lock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Hlogin from './Hlogin';

const Login = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        hosname: '',
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotification({ message: '', type: '' }); // Reset notification

        try {
            const user = await auth.hospitalLoginAction(formData);

            if (user.ok) {
                setNotification({ message: '🎉 Login successful!', type: 'success' });
                setFormData({ email: '', password: '', hosname: '' });
                navigate('/hospital/Dashboard');
            } else {
                setNotification({ message: user.error || '⚠️ Login failed. Please try again.', type: 'error' });
            }
        } catch (error) {
            setNotification({ message: `Error: ${error.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center" onClick={() => { navigate('/') }} style={{ cursor: 'pointer' }}>
                            <span className="text-2xl font-bold text-indigo-600">mediConnect</span>
                        </div>
                        <button
                            onClick={() => navigate('/hospital/Hsignup')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            Register <ChevronRight className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
                        <p className="mt-2 text-gray-600">Login to your account</p>
                    </div>

                    {/* Notification Section */}
                    {notification.message && (
                        <div className={`mb-4 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {notification.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">

                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    name="hosname"
                                    value={formData.hosname}
                                    onChange={handleChange}
                                    placeholder="Hospital Name"
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
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
