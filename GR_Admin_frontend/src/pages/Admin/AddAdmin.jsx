import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { image } from 'framer-motion/client';
import axios from 'axios';
import baseURL from '../../config/baseUrlConfig';

function AddAdmin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
    email: '',
    password: '',
    status: 'active',
    role: '',
    image:'',
    adminPhoto: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData({
      ...formData,
      adminPhoto: file,
      image: file.name
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }
};


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.gender) newErrors.gender = 'Gender selection is required';
    if (!formData.primaryPhoneNumber) newErrors.primaryPhoneNumber = 'Primary phone number is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (!formData.role) newErrors.role = 'Role selection is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    try {
      const data = new FormData();

      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axios.post(`${baseURL}/admin/register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert('Admin added successfully!');
      navigate('/admins');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong while submitting the form!');
    }
  } else {
    console.log('Form has errors');
  }
};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-6"
    >
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/admins')}
          className="mr-4 p-2 text-gray-300 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-100">Add New Admin</h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-700 mb-2">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile preview" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Upload className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => document.getElementById('profile-upload').click()}
                className="absolute bottom-2 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label className="text-sm text-gray-400">
              Upload Profile Picture
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`px-4 py-2 w-full border ${errors.name ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`px-4 py-2 w-full border ${errors.gender ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Primary Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="primaryPhoneNumber"
                value={formData.primaryPhoneNumber}
                onChange={handleChange}
                className={`px-4 py-2 w-full border ${errors.primaryPhoneNumber ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter primary phone number"
              />
              {errors.primaryPhoneNumber && <p className="mt-1 text-sm text-red-500">{errors.primaryPhoneNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Secondary Phone Number <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="tel"
                name="secondaryPhoneNumber"
                value={formData.secondaryPhoneNumber}
                onChange={handleChange}
                className="px-4 py-2 w-full border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter secondary phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`px-4 py-2 w-full border ${errors.email ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`px-4 py-2 w-full border ${errors.password ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter password"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-400">Password must be at least 8 characters long</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`px-4 py-2 w-full border ${errors.role ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="">Select Role</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Content Admin">Content Admin</option>
                <option value="Support Admin">Support Admin</option>
                <option value="Technical Admin">Technical Admin</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <div className="flex items-center space-x-6 mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === "active"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-300">Active</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === "inactive"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-300">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admins')}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default AddAdmin;