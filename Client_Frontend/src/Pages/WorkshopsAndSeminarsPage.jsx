import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Search, Filter, Users, Star, ChevronDown, X, Bookmark, Share2 } from 'lucide-react';
import baseURL from '../config/axiosPortConfig';

// Categories for filtering
const categories = [
  "All", "Leadership", "Marketing", "Finance", "Technology", 
  "Communication", "Business", "Sustainability", "Innovation"
];

const WorkshopsAndSeminarsPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch workshops data from the backend API
    const fetchWorkshops = async () => {
      try {
        const response = await fetch(`${baseURL}/api/workshops`);
        if (!response.ok) {
          throw new Error('Failed to fetch workshops data');
        }
        
        const result = await response.json();
        
        // Check if the data is properly structured
        const workshopsData = Array.isArray(result) ? result : 
                             (result.data && Array.isArray(result.data) ? result.data : []);
        
        setWorkshops(workshopsData);
        
        // Log the data to help diagnose structure issues
        console.log("Workshops data:", workshopsData);
        
        // Separate upcoming and past events
        const upcoming = workshopsData.filter(event => event.event_type === 'Upcoming Event');
        const past = workshopsData.filter(event => event.event_type === 'Past Event');
        
        setUpcomingEvents(upcoming);
        setPastEvents(past);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching workshops:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkshops();

    // Simulate loading delay for animation purposes
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter events based on search and category
  const filteredUpcomingEvents = upcomingEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.speaker && event.speaker.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeFilter === "All" || event.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, filteredUpcomingEvents.length));
  };

  const toggleEventDetails = (id) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <div className="text-red-600 text-xl mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Video Background */}
      <div className="relative h-96 overflow-hidden">
        {showVideo ? (
          <div className="absolute inset-0 bg-black">
            <video 
              autoPlay 
              muted 
              loop 
              className="w-full h-full object-cover opacity-70"
            >
              <source src="/api/placeholder/1920/1080" type="video/mp4" />
            </video>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute inset-0 bg-grid-white/10 bg-grid-16"></div>
          </div>
        )}
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
              Workshops & Seminars
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
            Expand your horizons, enhance your skills, and connect with industry leaders
          </p>
          <div className="flex space-x-4 animate-fade-in-up animation-delay-400">
            <button 
              onClick={() => document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-white text-purple-700 font-medium rounded-full hover:bg-opacity-90 transform transition duration-300 hover:scale-105 shadow-lg"
            >
              Explore Events
            </button>
            <button 
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-full hover:bg-white hover:bg-opacity-10 transform transition duration-300 hover:scale-105"
            >
              About
            </button>
          </div>
        </div>

        {/* Animated Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20L48 26.7C96 33.3 192 46.7 288 53.3C384 60 480 60 576 46.7C672 33.3 768 6.7 864 6.7C960 6.7 1056 33.3 1152 40C1248 46.7 1344 33.3 1392 26.7L1440 20V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V20Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Past Events Section */}
      <div id="featured" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Past Events
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
            Explore our previous workshops and seminars led by world-class industry experts
          </p>
        </div>
        
        {pastEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No past events available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pastEvents.slice(0, 3).map((event, index) => (
              <div 
                key={event.id} 
                className={`group relative overflow-hidden rounded-xl shadow-xl transform transition-all duration-1000 hover:-translate-y-2 hover:shadow-2xl ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${event.color || 'from-purple-600 to-indigo-600'} opacity-80 z-10`}></div>
                <img 
                  src={event.image || '/api/placeholder/400/300'} 
                  alt={event.title} 
                  className="h-96 w-full object-cover transform transition duration-700 group-hover:scale-110"
                  onError={(e) => {e.target.src = '/api/placeholder/400/300'}}
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold inline-block w-fit mb-3">
                    {event.category || 'Workshop'}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:underline decoration-2 underline-offset-4">{event.title}</h3>
                  <p className="text-white text-opacity-90 mb-4 line-clamp-2">{event.description || 'A workshop designed to enhance your professional skills.'}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="mr-2 flex-shrink-0" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock size={16} className="mr-2 flex-shrink-0" />
                      {event.time || 'TBA'}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      {event.location || 'Online'}
                    </div>
                    <div className="flex items-center text-sm">
                      <Users size={16} className="mr-2 flex-shrink-0" />
                      {event.spots || 'Limited'} spots
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-2">
                        <Users size={14} />
                      </div>
                      <span className="text-sm">{event.speaker || 'Expert Speaker'}</span>
                    </div>
                    <span className="font-bold">${parseFloat(event.price || 0).toFixed(2)}</span>
                  </div>
                  <a href={event.link || "#"} target="_blank" rel="noopener noreferrer" className="mt-4 w-full py-2.5 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg font-medium transition-all duration-300 transform group-hover:scale-105 text-center">
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search by title, category, or speaker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === category
                    ? 'bg-purple-600 text-white shadow-md transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Upcoming Workshops & Seminars
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
            Browse our upcoming events and register before they fill up
          </p>
        </div>

        {filteredUpcomingEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No upcoming events found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUpcomingEvents.slice(0, visibleCount).map((event) => (
              <div 
                key={event.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  expandedEvent === event.id ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-b ${event.color || 'from-purple-600 to-indigo-600'} opacity-30`}></div>
                  <img
                    src={event.image || '/api/placeholder/400/200'}
                    alt={event.title}
                    className="h-48 w-full object-cover"
                    onError={(e) => {e.target.src = '/api/placeholder/400/200'}}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="p-1.5 bg-white bg-opacity-80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-opacity-100 transition-all">
                      <Bookmark size={16} />
                    </button>
                    <button className="p-1.5 bg-white bg-opacity-80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-opacity-100 transition-all">
                      <Share2 size={16} />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold">
                    {event.category || 'Workshop'}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{event.title}</h3>
                    <div className="flex items-center bg-purple-100 px-2 py-1 rounded text-xs font-semibold text-purple-700">
                      <Star size={12} className="mr-1 fill-current text-yellow-500" />
                      {parseFloat(event.rating || 0).toFixed(1)}
                    </div>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-2 text-purple-600" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={14} className="mr-2 text-purple-600" />
                      {event.time || 'TBA'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-2 text-purple-600" />
                      {event.location || 'Online'}
                    </div>
                  </div>

                  {expandedEvent === event.id && (
                    <div className="mt-4 mb-4 text-gray-700 animate-fade-in">
                      <p className="mb-3">{event.description || "Join us for this exceptional workshop where you'll learn valuable skills from industry experts."}</p>
                      {event.tags && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(typeof event.tags === 'string' ? event.tags.split(',') : []).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <div className="flex -space-x-2 mr-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                            <img
                              src={`/api/placeholder/24/24`}
                              alt="Attendee"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{Math.floor(event.spots * 0.7) || '15'} attending</span>
                    </div>
                    
                    <button 
                      onClick={() => toggleEventDetails(event.id)}
                      className="text-sm font-medium text-purple-600 hover:text-purple-800"
                    >
                      {expandedEvent === event.id ? "Show less" : "Read more"}
                    </button>
                  </div>

                  <div className="mt-5 pt-5 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-gray-700">
                      <span className="font-bold text-gray-900">${parseFloat(event.price || 0).toFixed(2)}</span>
                    </div>
                    <a 
                      href={event.link || "#"}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Register Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredUpcomingEvents.length > visibleCount && (
          <div className="mt-10 text-center">
            <button 
              onClick={loadMore}
              className="inline-flex items-center px-6 py-3 border border-purple-300 text-base font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
            >
              Load More
              <ChevronDown size={16} className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(WorkshopsAndSeminarsPage);