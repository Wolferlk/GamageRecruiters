import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Search, Filter, Users, Star, ChevronDown, X, Bookmark, Share2 } from 'lucide-react';
import baseURL from '../config/axiosPortConfig';
import { toast, ToastContainer } from "react-toastify";

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
  const [sharePopupId, setSharePopupId] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);

  // Helper function to format image URLs correctly
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;// No placeholder
    if (imagePath.startsWith('http')) return imagePath;
    return `${baseURL}/uploads/workshops/images/${imagePath}`;
  };

  //share link
  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

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
  const title = (event.title || "").toLowerCase();
  const category = (event.category || "").toLowerCase();
  const speaker = (event.speaker || "").toLowerCase();
  const search = searchTerm.toLowerCase();

  const matchesSearch =
   !search || // If search is empty, match all
    title.includes(search) ||
    category.includes(search) ||
    speaker.includes(search);

  const matchesCategory = activeFilter.toLowerCase()  === "all" || category === activeFilter.toLowerCase();

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
      <ToastContainer />
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
          
          <div className="flex space-x-4 animate-fade-in-up animation-delay-400">
            <button 
              onClick={() => document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-white text-purple-700 font-medium rounded-full hover:bg-opacity-90 transform transition duration-300 hover:scale-105 shadow-lg"
            >
              Explore Events
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
                {getImageUrl(event.image) && (
                <img 
                  src={getImageUrl(event.image)} 
                  alt={event.title} 
                  className="h-96 w-full object-cover transform transition duration-700 group-hover:scale-110"
                  
                />
                )}
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
                    
                  </div>
                  
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
              <Search className="h-5 w-5 text-gray-400 cursor-pointer"/>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search by title, category, or speaker..."
              
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
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl "
                  
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-b ${event.color || 'from-purple-600 to-indigo-600'} opacity-30`}></div>
                  {getImageUrl(event.image) && (
                  <img
                    src={getImageUrl(event.image)}
                    alt={event.title}
                    className="h-48 w-full object-cover"
                    
                  />
                  )}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      className={`p-1.5 bg-white bg-opacity-80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-opacity-100 transition-all ${
                         savedEvents.includes(event.id) ? 'text-purple-600' : ''
                    }`}
                    onClick={() => {
                     setSavedEvents(prev =>
                       prev.includes(event.id)
                          ? prev.filter(id => id !== event.id)
                          : [...prev, event.id]
           );
              }}
             title={savedEvents.includes(event.id) ? "Unsave" : "Save"}
              >
               <Bookmark size={16} className={savedEvents.includes(event.id) ? "text-yellow-400" : ""}/>
             </button>
                    <button
                      className="p-1.5 bg-white bg-opacity-80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-opacity-100 transition-all relative"
                      onClick={() => setSharePopupId(sharePopupId === event.id ? null : event.id)}
                    >
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
                    
                    <button 
                      onClick={() => toggleEventDetails(event.id)}
                      className="text-sm font-medium text-purple-600 hover:text-purple-800"
                    >
                      {expandedEvent === event.id ? "Show less" : "Read more"}
                    </button>
                  </div>

                  <div className="mt-5 pt-5 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-gray-700">
                      <span className="font-bold text-gray-900">Rs {parseFloat(event.price || 0).toFixed(2)}</span>
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
      
      {sharePopupId && (() => {
        const event = filteredUpcomingEvents.find(e => e.id === sharePopupId);
        if (!event) return null;
        const shareUrl = event.link || window.location.origin + '/workshops/' + event.id;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative bg-white border border-gray-200 rounded shadow-lg p-12 w-full max-w-lg mx-2">
              <button
                onClick={() => setSharePopupId(null)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                aria-label="Close"
              >×</button>
              <div className="mb-4 text-xl font-bold text-gray-700 text-center">Share this event</div>
              <div className="flex gap-6 mb-6 justify-center">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(event.title + ' - ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on WhatsApp"
                  className="text-green-500 hover:text-green-700 text-4xl"
                >
                  <svg width="32" height="32" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.363.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.617h-.001a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374A9.86 9.86 0 012.13 12.04C2.13 6.495 6.626 2 12.175 2c2.652 0 5.144 1.037 7.019 2.921A9.823 9.823 0 0122.35 12.04c0 5.549-4.496 10.044-10.044 10.044zm8.413-18.457A11.815 11.815 0 0012.175 0C5.453 0 0 5.453 0 12.04c0 2.124.557 4.199 1.613 6.032L.057 24l6.09-1.6a11.89 11.89 0 005.998 1.561h.001c6.722 0 12.175-5.453 12.175-12.04 0-3.241-1.262-6.287-3.557-8.678z"/></svg>
                </a>
                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(shareUrl)}`}
                  title="Share via Email"
                  className="text-blue-500 hover:text-blue-700 text-4xl"
                >
                  <svg width="32" height="32" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"/></svg>
                </a>
                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on LinkedIn"
                  className="text-blue-700 hover:text-blue-900 text-4xl"
                >
                  <svg width="32" height="32" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                </a>
                {/* X (Twitter) */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title + ' - ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on X"
                  className="text-black hover:text-gray-700 text-4xl"
                >
                  <svg width="32" height="32" fill="currentColor"><path d="M22.162 5.656c.015.211.015.423.015.634 0 6.451-4.91 13.888-13.888 13.888-2.762 0-5.332-.809-7.496-2.211.383.045.766.06 1.164.06 2.293 0 4.402-.766 6.087-2.064-2.146-.045-3.953-1.457-4.58-3.404.3.045.6.075.915.075.436 0 .872-.06 1.278-.166-2.236-.451-3.92-2.422-3.92-4.797v-.06c.646.36 1.387.583 2.174.614-1.293-.872-2.146-2.35-2.146-4.027 0-.892.241-1.726.646-2.445 2.36 2.893 5.89 4.797 9.87 4.997-.075-.36-.12-.736-.12-1.112 0-2.7 2.192-4.892 4.892-4.892 1.406 0 2.678.6 3.57 1.564 1.112-.211 2.146-.614 3.08-1.164-.364 1.136-1.136 2.088-2.146 2.678 1-.12 1.96-.383 2.85-.766-.646.982-1.462 1.842-2.406 2.53z"/></svg>
                </a>
                {/* Copy Link */}
                <button
                  onClick={() => handleCopyLink(shareUrl)}
                  title="Copy link"
                  className="text-purple-600 hover:text-purple-800 text-4xl"
                >
                  <svg width="32" height="32" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                </button>
              </div>
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="w-full px-4 py-2 border rounded text-base mb-4"
              />
              <button
                onClick={() => handleCopyLink(shareUrl)}
                className="w-full bg-purple-600 text-white text-base py-2 rounded hover:bg-purple-700 font-semibold"
              >
                Copy Link
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default memo(WorkshopsAndSeminarsPage);