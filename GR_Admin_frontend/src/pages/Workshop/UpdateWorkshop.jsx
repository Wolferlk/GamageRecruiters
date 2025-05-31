import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, MapPin, Users, DollarSign, 
  Clock, Tag, Save, Send, X, Plus, Upload, Star,
  Loader, AlertTriangle, CheckCircle
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function UpdateWorkshop() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    image: '',
    color: 'from-blue-500 to-purple-600',
    speaker: '',
    price: '',
    spots: '',
    rating: 4.5,
    description: '',
    event_type: 'Upcoming Event',
    link: ''
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const categories = [
    'Technology', 'Business', 'Finance', 'Marketing', 
    'Leadership', 'Design', 'Sustainability', 'Health'
  ];
  
  const colorOptions = [
    { name: 'Purple', value: 'from-blue-500 to-purple-600' },
    { name: 'Teal', value: 'from-green-500 to-teal-600' },
    { name: 'Orange', value: 'from-amber-500 to-orange-600' },
    { name: 'Blue', value: 'from-indigo-500 to-blue-600' },
    { name: 'Pink', value: 'from-red-500 to-pink-600' }
  ];

  // Fetch workshop data
  useEffect(() => {
    const fetchWorkshopData = async () => {
      setFetchLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/workshops/${id}`);
        console.log('Workshop data:', response.data);
        const workshopData = response.data.data[0];
  
        setFormData({
          title: workshopData.title || '',
          category: workshopData.category || '',
          date: workshopData.date || '',
          time: workshopData.time || '',
          location: workshopData.location || '',
          image: workshopData.image || '',
          color: workshopData.color || 'from-blue-500 to-purple-600',
          speaker: workshopData.speaker || '',
          price: workshopData.price || '',
          spots: workshopData.spots || '',
          rating: workshopData.rating || 4.5,
          description: workshopData.description || '',
          event_type: workshopData.event_type || 'Upcoming Event',
          link: workshopData.link || ''
        });
  
        if (workshopData.image) {
          setPreviewImage(getImageUrl(workshopData.image));
        }
  
        setFetchError(null);
      } catch (error) {
        console.error('Error fetching workshop data:', error);
        setFetchError('Failed to load workshop data. Please try again.');
      } finally {
        setFetchLoading(false);
      }
    };
  
    fetchWorkshopData();
  }, [id]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Just store the file object directly for upload
    setFormData({
      ...formData,
      image: file
    });
    
    // Still create preview for UI
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  }
};
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUpdateSuccess(false);
    
    try {
      const formDataObj = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key === 'image') {
          // Handle image differently based on type
          if (formData.image instanceof File) {
            formDataObj.append('workshopImage', formData.image);
          } else if (typeof formData.image === 'string' && formData.image.startsWith('http')) {
            formDataObj.append('image', formData.image);
          }
        } else {
          formDataObj.append(key, formData[key]);
        }
      });
      
      await axios.put(
        `http://localhost:8000/api/workshops/update/${id}`, 
        formDataObj,
        { 
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      
      // Show success message
      setUpdateSuccess(true);
      
      // After a brief delay to show success message, redirect
      setTimeout(() => {
        navigate('/workshops');
      }, 1500);
    } catch (error) {
      console.error('Error updating workshop:', error);
      alert(`Failed to update workshop: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getGradientPreview = (color) => {
    return `bg-gradient-to-r ${color}`;
  };

  // Show loading spinner while fetching data
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="h-10 w-10 mx-auto animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading workshop data...</p>
        </div>
      </div>
    );
  }

  // Show error message if fetch failed
  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center bg-red-50 dark:bg-red-900/20 p-6 rounded-lg max-w-md">
          <AlertTriangle className="h-10 w-10 mx-auto text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-red-800 dark:text-red-300">Failed to load workshop</h3>
          <p className="mt-1 text-red-700 dark:text-red-400">{fetchError}</p>
          <button 
            onClick={() => navigate('/workshops')}
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-700"
          >
            Return to Workshops
          </button>
        </div>
      </div>
    );
  }

  // gives the full image url with the support of a fallback placholder
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x200?text=Workshop";
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/uploads/workshops/images/${imagePath}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-5xl mx-auto px-4 py-6"
    >
      {/* Success Message */}
      {updateSuccess && (
        <div className="fixed top-6 right-6 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg shadow-lg z-50 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Workshop updated successfully! Redirecting...
        </div>
      )}
    
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/workshops" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Workshop</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update details for this workshop</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={(e) => handleUpdate(e, 'draft')} 
            disabled={loading}
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button 
            onClick={(e) => handleUpdate(e, 'publish')} 
            disabled={loading}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            {loading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {loading ? 'Updating...' : 'Update Workshop'}
          </button>
        </div>
      </div>
      
      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workshop Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Workshop Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter a compelling workshop title..."
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-lg transition-all"
                  required
                />
              </div>
              
              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date*
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id="date"
                      name="date"
                      placeholder="e.g. June 15, 2025"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                
                {/* Time */}
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time*
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id="time"
                      name="time"
                      placeholder="e.g. 9:00 AM - 5:00 PM"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location*
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="e.g. Tech Hub, San Francisco"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Workshop Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  placeholder="Describe the workshop, objectives, and what attendees will learn..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              {/* Speaker */}
              <div>
                <label htmlFor="speaker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Speaker / Presenter*
                </label>
                <input
                  type="text"
                  id="speaker"
                  name="speaker"
                  placeholder="e.g. Dr. Jane Smith"
                  value={formData.speaker}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Registration Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Registration Details</h3>
              
              {/* Price and Spots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price*
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id="price"
                      name="price"
                      placeholder="e.g. $199"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                
                {/* Available Spots */}
                <div>
                  <label htmlFor="spots" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Available Spots*
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id="spots"
                      name="spots"
                      placeholder="e.g. 20 spots remaining"
                      value={formData.spots}
                      onChange={handleInputChange}
                      className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Registration Link */}
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Registration Link
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`h-6 w-6 ${
                          star <= formData.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {formData.rating} out of 5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Visual Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Preview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className={`h-32 ${getGradientPreview(formData.color)}`}></div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1 truncate">
                {formData.title || "Workshop Title Preview"}
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formData.date || "Date"}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{formData.location || "Location"}</span>
              </div>
              <div className="mb-2 text-sm italic text-gray-500 dark:text-gray-400">
                Presented by {formData.speaker || "Speaker Name"}
              </div>
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Workshop preview" 
                  className="w-full h-48 object-cover rounded-lg mb-3" 
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-gray-400 dark:text-gray-500">Workshop Image</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="font-medium">{formData.price || "$199"}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{formData.spots || "20 spots remaining"}</div>
              </div>
            </div>
          </div>
          
          {/* Visual Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Visual Settings</h3>
              
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Featured Image*
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                  {previewImage ? (
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData({...formData, image: ''});
                        }} 
                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="h-48 object-cover rounded-lg mx-auto mb-2" 
                      />
                    </div>
                  ) : (
                    <div className="py-4 space-y-2">
                      <Upload className="h-10 w-10 mx-auto text-gray-400" />
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Drag and drop an image, or 
                        <label className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer ml-1">
                          browse
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Recommended: 1200x800 pixels, PNG or JPG
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Category */}
              <div className="relative">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category*
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="category"
                    name="category"
                    placeholder="Select a category"
                    value={formData.category}
                    onChange={handleInputChange}
                    onClick={() => setShowCategoryDropdown(true)}
                    className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    required
                  />
                </div>
                {showCategoryDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto">
                    {categories.map((category) => (
                      <div 
                        key={category} 
                        className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setFormData({...formData, category});
                          setShowCategoryDropdown(false);
                        }}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Accent Color
                </label>
                <div className="relative">
                  <div 
                    className={`h-10 rounded-lg cursor-pointer ${getGradientPreview(formData.color)}`}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  ></div>
                  
                  {showColorPicker && (
                    <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                      {colorOptions.map((color) => (
                        <div 
                          key={color.value} 
                          className="px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => {
                            setFormData({...formData, color: color.value});
                            setShowColorPicker(false);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`h-6 w-6 rounded-full bg-gradient-to-r ${color.value}`}></div>
                            <span>{color.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Event Type */}
              <div>
                <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event Type*
                </label>
                <select
                  id="event_type"
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                  required
                >
                  <option value="Upcoming Event">Upcoming Event</option>
                  <option value="Past Event">Past Event</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Delete Workshop Button */}
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this workshop? This action cannot be undone.')) {
                // Add your delete logic here
                axios.delete(`http://localhost:8000/api/workshops/${id}`)
                  .then(() => {
                    alert('Workshop deleted successfully');
                    navigate('/workshops');
                  })
                  .catch(error => {
                    console.error('Error deleting workshop:', error);
                    alert('Failed to delete workshop');
                  });
              }
            }}
            className="w-full py-2 px-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors flex items-center justify-center"
          >
            <X className="h-4 w-4 mr-2" />
            Delete Workshop
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default UpdateWorkshop;