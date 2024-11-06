import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaClock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';

const Welcome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const urlUser = params.get('user');

    if (token && urlUser) {
      const parsedUser = JSON.parse(decodeURIComponent(urlUser));
      dispatch(login(token, parsedUser));
      window.history.replaceState({}, document.title, '/welcome');
    }
  }, [dispatch]);

  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-12 text-white">
            <h1 className="text-4xl font-bold mb-4">
              Welcome, {user?.username}! 👋
            </h1>
            <p className="text-purple-100 text-lg">
              We're excited to have you here. Let's make something amazing together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            <div className="bg-purple-50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-600 rounded-lg p-3">
                  <FaUser className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">Username</h3>
                  <p className="text-gray-900 font-semibold">{user?.username}</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-600 rounded-lg p-3">
                  <FaEnvelope className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">Email</h3>
                  <p className="text-gray-900 font-semibold">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="bg-pink-600 rounded-lg p-3">
                  <FaClock className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">Joined On</h3>
                  <p className="text-gray-900 font-semibold">{joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaUser />
                <span>Edit Profile</span>
              </button>
              <button
                className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaEnvelope />
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
