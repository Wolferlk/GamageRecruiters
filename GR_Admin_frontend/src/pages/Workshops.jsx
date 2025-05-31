import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Calendar, MapPin, ExternalLink, Star, RefreshCw, AlertTriangle, Moon, Search, Filter, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Workshops() {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/workshops');
      
      // Handle different response structures
      if (response.data) {
        // If response.data is an array, use it directly
        if (Array.isArray(response.data)) {
          setWorkshops(response.data);
        } 
        // If response.data contains a data property that is an array, use that
        else if (response.data.data && Array.isArray(response.data.data)) {
          setWorkshops(response.data.data);
        }
        // If response.data contains a workshops property that is an array, use that
        else if (response.data.workshops && Array.isArray(response.data.workshops)) {
          setWorkshops(response.data.workshops);
        }
        // If unable to find an array, log the response and set an empty array
        else {
          console.error("Unexpected API response format:", response.data);
          setWorkshops([]);
          setError("Unexpected data format received from server");
        }
      } else {
        setWorkshops([]);
      }
    } catch (err) {
      console.error("Failed to fetch workshops:", err);
      setError("Failed to load workshops. Please try again later.");
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusFromEventType = (eventType) => {
    if (eventType === 'Past Event') return 'completed';
    return 'upcoming';
  };

  // Extract unique categories for filtering
  const categories = ['all', ...new Set(Array.isArray(workshops) ? 
    workshops.map(workshop => workshop.category).filter(Boolean) : [])];

  const filteredWorkshops = Array.isArray(workshops) ? workshops.filter(workshop => {
    // Filter by event type
    if (filter !== 'all' && getStatusFromEventType(workshop.event_type) !== filter) {
      return false;
    }
    
    // Filter by category
    if (categoryFilter !== 'all' && workshop.category !== categoryFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !workshop.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !workshop.category?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !workshop.location?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }) : [];

  // Analytics data
  const upcomingCount = Array.isArray(workshops) ? 
    workshops.filter(w => w.event_type === 'Upcoming Event').length : 
    0;
    
  const totalRegistrations = Array.isArray(workshops) ? 
    workshops.reduce((sum, w) => sum + ((w.capacity || 0) - (w.spots || 0)), 0) :
    0;
    
  const averageRating = Array.isArray(workshops) && workshops.length > 0 ? 
    (workshops.reduce((sum, w) => sum + (w.rating || 0), 0) / workshops.length).toFixed(1) :
    '0.0';

  const categoryColors = {
    'Technology': 'bg-blue-500',
    'Business': 'bg-purple-500',
    'Arts': 'bg-pink-500',
    'Science': 'bg-green-500',
    'Health': 'bg-red-500',
    'Education': 'bg-yellow-500',
  };

  const getCategoryColor = (category) => {
    return categoryColors[category] || 'bg-gray-500';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString || 'Date not available';
    }
  };

  // Card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.05,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0]
      } 
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x200?text=Workshop";
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/uploads/workshops/images/${imagePath}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 text-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                Workshops & Seminars
                <span className="inline-flex ml-3 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-300">
                  Dark Mode
                </span>
              </h1>
              <p className="text-gray-400 mt-1">Discover and manage all your educational events</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/workshops/add")}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/30"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Workshop
            </motion.button>
          </div>

          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search workshops..."
                  className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:w-auto flex items-center justify-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors border border-gray-600"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600"
              >
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">Event Status</p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-indigo-600 text-white font-medium' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setFilter('upcoming')}
                      className={`px-4 py-2 rounded-lg transition-colors ${filter === 'upcoming' ? 'bg-green-600 text-white font-medium' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                    >
                      Upcoming
                    </button>
                    <button 
                      onClick={() => setFilter('completed')}
                      className={`px-4 py-2 rounded-lg transition-colors ${filter === 'completed' ? 'bg-gray-500 text-white font-medium' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                    >
                      Past
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4 md:mt-0">
                  <p className="text-sm font-medium text-gray-300">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setCategoryFilter(category)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          categoryFilter === category 
                            ? category !== 'all' 
                              ? `${getCategoryColor(category)} text-white font-medium` 
                              : 'bg-indigo-600 text-white font-medium'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        }`}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <RefreshCw className="h-12 w-12 text-indigo-400" />
              </motion.div>
              <p className="mt-4 text-gray-400 font-medium">Loading workshops...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Failed to load workshops</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <button 
                onClick={fetchWorkshops}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >
                Try Again
              </button>
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-200 mt-4">No workshops found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkshops.map((workshop, index) => {
                  const isPast = workshop.event_type === 'Past Event';
                  const spots = workshop.spots || 0;
                  const capacity = workshop.capacity || 100;
                  const percentFull = capacity > 0 ? Math.round(((capacity - spots) / capacity) * 100) : 100;
                  
                  return (
                    <motion.div
                      key={workshop.id || index}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className={`bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-900/20 transition-all ${isPast ? 'opacity-80' : ''}`}
                    >
                      <div className="relative h-48 overflow-hidden rounded-t-xl">
                        {workshop.image ? (
                          <img 
                            src={getImageUrl(workshop.image)} 
                            alt={workshop.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/400x200?text=Workshop";
                            }}
                          />
                        ) : (
                          <img  
                            src="https://via.placeholder.com/400x200?text=Workshop" 
                            alt="Workshop placeholder" 
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-4 flex items-center space-x-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            getStatusFromEventType(workshop.event_type) === 'upcoming'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-gray-700 text-gray-300'
                          }`}>
                            {workshop.event_type || 'Unknown Status'}
                          </span>
                          {workshop.category && (
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(workshop.category)} bg-opacity-90 text-white`}>
                              {workshop.category}
                            </span>
                          )}
                        </div>
                        {workshop.rating && (
                          <div className="absolute top-4 right-4 bg-gray-900/90 rounded-full px-2 py-1 flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                            <span className="text-xs font-bold text-gray-100">{workshop.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-100 line-clamp-2 h-14">{workshop.title || 'Untitled Workshop'}</h3>
                        
                        <div className="mt-4 space-y-3 text-sm">
                          <div className="flex items-center text-gray-400">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{workshop.date ? formatDate(workshop.date) : 'Date not specified'}</span>
                          </div>
                          {workshop.location && (
                            <div className="flex items-center text-gray-400">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="line-clamp-1">{workshop.location}</span>
                            </div>
                          )}
                          <div className="flex items-center text-gray-400">
                            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>
                              {capacity - spots} / {capacity} registered
                            </span>
                          </div>
                          {workshop.speaker && (
                            <div className="flex items-center text-gray-400">
                              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>{workshop.speaker}</span>
                            </div>
                          )}
                        </div>

                        {!isPast && (
                          <div className="mt-6">
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className={`text-xs font-semibold inline-block ${
                                    percentFull >= 90 ? 'text-red-400' : 'text-indigo-400'
                                  }`}>
                                    {percentFull}% Full
                                  </span>
                                </div>
                                {workshop.price > 0 && (
                                  <div className="text-right">
                                    <span className="text-xs font-semibold text-gray-300">
                                      ${parseFloat(workshop.price).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentFull}%` }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                    percentFull >= 90 ? 'bg-red-500' : 'bg-indigo-500'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-6 flex justify-between space-x-2">
                          {workshop.id && (  
                            <div className="flex gap-2 w-full">
                              <button 
                                onClick={() => navigate(`/workshops/edit/${workshop.id}`)}
                                className="flex-1 px-3 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                className="flex-1 px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center"
                              >
                                <span>View Details</span>
                                <ExternalLink className="h-4 w-4 ml-1" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </div>
        
        <div className="bg-gray-800 rounded-2xl p-6 mt-8 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-100">Workshop Analytics</h3>
              <p className="text-gray-400 mt-1">Quick stats about your workshop performance</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 md:mt-0 w-full md:w-auto">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-indigo-500 transition-all"
              >
                <p className="text-sm text-gray-400">Total Workshops</p>
                <p className="text-2xl font-bold text-white">{Array.isArray(workshops) ? workshops.length : 0}</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-green-500 transition-all"
              >
                <p className="text-sm text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-green-400">{upcomingCount}</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-yellow-500 transition-all"
              >
                <p className="text-sm text-gray-400">Average Rating</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-yellow-400">{averageRating}</p>
                  <Star className="h-4 w-4 text-yellow-400 ml-1 fill-yellow-400" />
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-indigo-500 transition-all"
              >
                <p className="text-sm text-gray-400">Total Registrations</p>
                <p className="text-2xl font-bold text-indigo-400">{totalRegistrations}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Workshops;