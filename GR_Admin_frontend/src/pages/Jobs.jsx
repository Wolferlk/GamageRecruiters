import React, { useState, useEffect } from 'react';
import { 
  Search, Edit2, Trash2, MapPin, Clock, DollarSign, 
  Briefcase, Calendar, PlusCircle, Filter, ChevronDown, Loader,
  Star, Moon, Sun, Zap, TrendingUp, Coffee, X, ArrowLeft, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import baseURL from '../config/baseUrlConfig';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    jobType: '',
    location: ''
  });
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Job details modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedJob, setEditedJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clientBaseUrl = import.meta.env.VITE_CLIENT_BASE_URL;

  // Fetch jobs data from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseURL}/api/jobs`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        
        // Ensure data is an array
        const jobsArray = Array.isArray(data) ? data : data.jobs || [];
        setJobs(jobsArray);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching jobs:', err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch specific job details
  const fetchJobDetails = async (jobId) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/api/jobs/${jobId}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      const result = await response.json();
      if (result.data) {
        // Process the data before setting it
        const processedJob = {
          ...result.data,
          responsibilities: normalizeField(result.data.responsibilities),
          requirements: normalizeField(result.data.requirements),
          benefits: normalizeField(result.data.benefits)
        };
        setSelectedJob(processedJob);
        setEditedJob(processedJob);
      } else {
        throw new Error('No job data found');
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const normalizeField = (field) => {
    if (!field) return '';
    
    // If it's already an array, join with newlines
    if (Array.isArray(field)){
      return field.join('\n');
    } 
    
    try {
      // Try to parse JSON
      const parsedArray = JSON.parse(field);
      if (Array.isArray(parsedArray)) {
        // Return array items joined by newlines
        return parsedArray.join('\n');
      }
    } catch {
      // Not JSON, return as is
    }
    return field;
  };
  // Handle updating job
  const handleUpdateJob = async () => {
    if (!editedJob) return;

     // Validate required fields
    if (!editedJob.jobName || !editedJob.company || !editedJob.jobType) {
      setError('Job Title, Company, and Job Type are required.');
      return;
    }

    // Format array fields before sending to backend
    const formatFieldForBackend = (field) => {
      if (!field || field.trim() === '') {
        return JSON.stringify([]);  // Return empty array as JSON string
      }
      // Split by newlines and filter out empty lines
      const items = field.split('\n').filter(item => item.trim() !== '');
      return JSON.stringify(items);
    };

    const jobToSave = {
      ...editedJob,
      requirements: formatFieldForBackend(editedJob.requirements),
      responsibilities: formatFieldForBackend(editedJob.responsibilities),
      benefits: formatFieldForBackend(editedJob.benefits),
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(`${baseURL}/api/jobs/update/${editedJob.jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobToSave),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      // Update the jobs list with the saved job
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.jobId === editedJob.jobId ? {
            ...job,
            ...jobToSave,
            // Keep the formatted JSON strings for display
            requirements: editedJob.requirements,
            responsibilities: editedJob.responsibilities,
            benefits: editedJob.benefits
          } : job
        )
      );

      // Update the selected job
      setSelectedJob({
        ...jobToSave,
        requirements: editedJob.requirements,
        responsibilities: editedJob.responsibilities,
        benefits: editedJob.benefits
      });
      setIsEditMode(false);

    } catch (err) {
      console.error('Error updating job:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Apply filters and search
  const filteredJobs = Array.isArray(jobs) ? jobs.filter(job => {
    const matchesSearch = 
      (job.jobName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (job.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesJobType = filters.jobType ? job.jobType === filters.jobType : true;
    const matchesLocation = filters.location ? 
      (job.jobLocation || '').includes(filters.location) : true;
    
    return matchesSearch && matchesJobType && matchesLocation;
  }) : [];

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Get unique locations for filter
  const uniqueLocations = Array.isArray(jobs) ? 
    [...new Set(jobs.map(job => job.jobLocation).filter(Boolean))] : [];
  
  // Get unique job types for filter
  const uniqueJobTypes = Array.isArray(jobs) ? 
    [...new Set(jobs.map(job => job.jobType).filter(Boolean))] : [];

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`${baseURL}/api/jobs/delete/${jobId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete job');
        }
        
        setJobs(jobs.filter(job => job.jobId !== jobId));

        // Close modal if the deleted job is currently selected
        if (selectedJob && selectedJob.jobId === jobId) {
          setIsViewModalOpen(false);
          setSelectedJob(null);
        }
      } catch (err) {
        console.error('Error deleting job:', err);
        setError(err.message);
      }
    }
  };

  // Check if a date is within the last 7 days
  const isNewJob = (dateString) => {
    if (!dateString) return false;
    try {
      const jobDate = new Date(dateString);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return jobDate > oneWeekAgo;
    } catch (e) {
      return false;
    }
  };

  // Handle job editing
  const handleEditJob = (jobId) => {
    fetchJobDetails(jobId);
    setIsViewModalOpen(true);
    setIsEditMode(true);
  };

  // Handle view job details
  const handleViewJob = (jobId) => {
    fetchJobDetails(jobId);
    setIsViewModalOpen(true);
    setIsEditMode(false);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setIsEditMode(false);
    setSelectedJob(null);
    setEditedJob(null);
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedJob(prevJob => ({
      ...prevJob,
      [name]: value
    }));
  };

  // Job type icon mapping
  const getJobTypeIcon = (jobType) => {
    if (!jobType) return <Briefcase className="h-4 w-4 text-white" />;

    const type = jobType.toLowerCase();
    if (type.includes('full')) return <Coffee className="h-4 w-4 text-white" />;
    if (type.includes('part')) return <Clock className="h-4 w-4 text-white" />;
    if (type.includes('contract')) return <Zap className="h-4 w-4 text-white" />;
    if (type.includes('freelance')) return <TrendingUp className="h-4 w-4 text-white" />;
    return <Briefcase className="h-4 w-4 text-white" />;
  };

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const accentColor = isDarkMode ? 'text-violet-400' : 'text-violet-600';
  const accentBg = isDarkMode ? 'bg-violet-500' : 'bg-violet-600';
  const inputBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const hoverBg = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className={`text-2xl font-bold flex items-center ${textColor}`}>
              <Briefcase className="mr-2 h-6 w-6" />
              Job Management
            </h1>
            <p className={mutedText}>
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-yellow-300" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>
            <button
              onClick={() => navigate("/jobs/add")}
              className={`flex items-center px-4 py-2 rounded-lg ${accentBg} text-white`}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Job
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`${cardBg} rounded-lg shadow-md mb-6 transition-colors ${borderColor} border p-4 flex flex-col lg:flex-row gap-4`}>
          <div className="relative flex-grow">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${mutedText} h-4 w-4`} />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-9 pr-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-offset-0 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-violet-500'
                  : 'border border-gray-200 focus:ring-violet-500'
              } transition-colors`}
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center justify-between w-full lg:w-40 px-3 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border border-gray-600 hover:border-violet-500 text-gray-200'
                  : 'border border-gray-200 hover:border-violet-500'
              }`}
            >
              <div className="flex items-center">
                <Filter className={`h-4 w-4 mr-2 ${mutedText}`} />
                <span>Filters</span>
              </div>
              <ChevronDown className={`h-4 w-4 ${mutedText} transition-transform ${filterOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {filterOpen && (
              <div 
                className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-10 p-4 ${
                  cardBg
                } ${borderColor} border`}
              >
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Job Type
                  </label>
                  <select 
                    value={filters.jobType}
                    onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                    className={`w-full rounded-lg py-2 px-3 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                        : 'border border-gray-200'
                    }`}
                  >
                    <option value="">All Types</option>
                    {uniqueJobTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-2">
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Location
                  </label>
                  <select 
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className={`w-full rounded-lg py-2 px-3 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                        : 'border border-gray-200'
                    }`}
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <button 
                  onClick={() => setFilters({ jobType: '', location: '' })}
                  className={`w-full mt-3 text-sm text-center py-1 px-2 rounded ${
                    isDarkMode ? 'text-violet-400 hover:bg-gray-700' : 'text-violet-600 hover:bg-gray-100'
                  }`}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Job Listings */}
        {loading && !isViewModalOpen ? (
          <div className="flex justify-center items-center py-20">
            <Loader className={`h-6 w-6 ${accentColor} animate-spin`} />
            <span className={`ml-3 ${textColor}`}>Loading jobs...</span>
          </div>
        ) : error && !isViewModalOpen ? (
          <div className={`px-4 py-3 rounded-lg ${
            isDarkMode 
              ? 'bg-red-900/30 border border-red-800/50 text-red-300' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            Error: {error}. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
              <div
                key={job.jobId || Math.random()}
                className={`rounded-lg overflow-hidden transition-all duration-200 hover:translate-y-[-4px] ${
                  cardBg
                } ${borderColor} border hover:shadow-lg`}
              >
                <div className={`border-l-4 ${
                  isDarkMode 
                    ? isNewJob(job.postedDate) ? 'border-green-500' : 'border-violet-500'
                    : isNewJob(job.postedDate) ? 'border-green-500' : 'border-violet-500'
                } p-4`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className={`text-lg font-medium line-clamp-1 ${textColor}`}>
                        {job.jobName || 'Untitled Job'}
                      </h3>
                      <p className={`mt-1 ${accentColor}`}>{job.company || 'Unknown Company'}</p>
                    </div>
                    {isNewJob(job.postedDate) && (
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        isDarkMode 
                          ? 'bg-green-900/50 text-green-300'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        New
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    {job.jobLocation && (
                      <div className={`flex items-center text-sm ${mutedText}`}>
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.jobLocation}
                      </div>
                    )}
                    <div className={`flex items-center text-sm ${mutedText}`}>
                      {getJobTypeIcon(job.jobType)}
                      <span className="ml-2">{job.jobType || 'Full-time'}</span>
                    </div>
                    {job.salaryRange && (
                      <div className={`flex items-center text-sm ${mutedText}`}>
                        <DollarSign className="h-4 w-4 mr-2" />
                        {job.salaryRange}
                      </div>
                    )}
                  </div>

                  <div className={`mt-4 pt-3 flex justify-between items-center border-t ${borderColor}`}>
                    <button 
                      onClick={() => handleViewJob(job.jobId)}
                      className={`py-1.5 px-3 rounded text-sm font-medium ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}>
                      View Details
                    </button>
                    <button
                      onClick={() => window.open(`${clientBaseUrl}/jobs/${job.jobId}`, '_blank')}
                      className={`py-1.5 px-3 rounded text-sm font-medium ${
                        isDarkMode
                          ? 'bg-blue-700 hover:bg-blue-600 text-white'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      } ml-2`}
                    >
                      Public View
                    </button>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleEditJob(job.jobId)}
                        className={`p-1.5 rounded ${
                          isDarkMode 
                            ? 'text-gray-400 hover:text-violet-400 hover:bg-gray-700'
                            : 'text-gray-500 hover:text-violet-600 hover:bg-gray-100'
                        }`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteJob(job.jobId)}
                        className={`p-1.5 rounded ${
                          isDarkMode 
                            ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                            : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
                <div
                  className={`rounded-lg p-8 max-w-lg mx-auto ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}
                >
                  <Briefcase className={`h-12 w-12 mx-auto mb-4 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-lg font-medium mb-2 ${textColor}`}>No jobs found</h3>
                  <p className={`mb-6 ${mutedText}`}>
                    No jobs match your current search. Try adjusting your filters or search term.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ jobType: '', location: '' });
                    }}
                    className={`px-4 py-2 rounded-lg ${accentBg} text-white`}
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {isViewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
          onClick={handleCloseModal}
        >
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg ${cardBg} shadow-xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className={`h-6 w-6 ${accentColor} animate-spin`} />
                <span className={`ml-3 ${textColor}`}>Loading job details...</span>
              </div>
            ) : error ? (
              <div className={`p-6 ${
                isDarkMode ? 'text-red-300' : 'text-red-600'
              }`}>
                <p>Error: {error}</p>
                <button 
                  onClick={handleCloseModal}
                  className={`mt-4 px-4 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  Close
                </button>
              </div>
            ) : selectedJob ? (
              <>
                {/* Modal Header */}
                <div className={`sticky top-0 z-10 flex justify-between items-center p-4 ${
                  cardBg
                } border-b ${borderColor}`}>
                  <div className="flex items-center">
                    <button
                      onClick={handleCloseModal}
                      className={`mr-3 p-1.5 rounded-full ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h2 className={`text-lg font-medium ${textColor}`}>
                      {isEditMode ? 'Edit Job' : 'Job Details'}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditMode ? (
                      <>
                        <button
                          onClick={() => {
                            setIsEditMode(false);
                            setEditedJob(selectedJob);
                          }}
                          className={`p-1.5 px-3 rounded-lg text-sm ${
                            isDarkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateJob}
                          disabled={isSubmitting}
                          className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${accentBg} text-white ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          {isSubmitting ? (
                            <Loader className="h-3 w-3 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-3 w-3 mr-2" />
                          )}
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsEditMode(true)}
                          className={`p-1.5 rounded-lg ${
                            isDarkMode 
                              ? 'bg-gray-700 text-violet-400 hover:bg-gray-600'
                              : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
                          }`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(selectedJob.jobId)}
                          className={`p-1.5 rounded-lg ${
                            isDarkMode 
                              ? 'bg-gray-700 text-red-400 hover:bg-gray-600'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCloseModal}
                          className={`p-1.5 rounded-lg ${
                            isDarkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-4">
                  <div className="space-y-5">
                    {/* Job Name */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Job Title
                      </label>
                      {isEditMode ? (
                        <input
                          type="text"
                          name="jobName"
                          value={editedJob.jobName || ''}
                          onChange={handleInputChange}
                          className={`w-full p-2 rounded-lg ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200'
                              : 'border border-gray-200'
                          }`}
                        />
                      ) : (
                        <p className={`${isDarkMode ? 'text-gray-100' : 'text-gray-800'} font-medium`}>
                          {selectedJob.jobName}
                        </p>
                      )}
                    </div>

                    {/* Company */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Company
                      </label>
                      {isEditMode ? (
                        <input
                          type="text"
                          name="company"
                          value={editedJob.company || ''}
                          onChange={handleInputChange}
                          className={`w-full p-2 rounded-lg ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200'
                              : 'border border-gray-200'
                          }`}
                        />
                      ) : (
                        <p className={accentColor}>
                          {selectedJob.company}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Location */}
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Location
                        </label>
                        {isEditMode ? (
                          <input
                            type="text"
                            name="jobLocation"
                            value={editedJob.jobLocation || ''}
                            onChange={handleInputChange}
                            className={`w-full p-2 rounded-lg ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-200'
                                : 'border border-gray-200'
                            }`}
                          />
                        ) : (
                          <div className="flex items-center">
                            <MapPin className={`h-4 w-4 mr-2 ${mutedText}`} />
                            <p className={textColor}>
                              {selectedJob.jobLocation ? selectedJob.jobLocation : ''}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Job Type */}
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Job Type
                        </label>
                        {isEditMode ? (
                          <select
                            name="jobType"
                            value={editedJob.jobType || ''}
                            onChange={handleInputChange}
                            className={`w-full p-2 rounded-lg ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-200'
                                : 'border border-gray-200'
                            }`}
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Internship">Internship</option>
                          </select>
                        ) : (
                          <div className="flex items-center">
                            {getJobTypeIcon(selectedJob.jobType)}
                            <p className={`ml-2 ${textColor}`}>
                              {selectedJob.jobType || 'Full-time'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Salary Range */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Salary Range
                      </label>
                      {isEditMode ? (
                        <input
                          type="text"
                          name="salaryRange"
                          value={editedJob.salaryRange || ''}
                          onChange={handleInputChange}
                          className={`w-full p-2 rounded-lg ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200'
                              : 'border border-gray-200'
                          }`}
                          placeholder="e.g. $50,000 - $70,000"
                        />
                      ) : (
                        <div className="flex items-center">
                          <DollarSign className={`h-4 w-4 mr-2 ${mutedText}`} />
                          <p className={textColor}>
                            {selectedJob.salaryRange ? selectedJob.salaryRange : ''}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Posted Date */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Posted Date
                      </label>
                      {isEditMode ? (
                        <input
                          type="date"
                          name="postedDate"
                          value={editedJob.postedDate ? new Date(editedJob.postedDate).toISOString().split('T')[0] : ''}
                          onChange={handleInputChange}
                          className={`w-full p-2 rounded-lg ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200'
                              : 'border border-gray-200'
                          }`}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Calendar className={`h-4 w-4 mr-2 ${mutedText}`} />
                          <p className={textColor}>
                            {selectedJob.postedDate ? formatDate(selectedJob.postedDate) : 'Unknown date'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Job Description */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Job Description
                      </label>
                      {isEditMode ? (
                        <textarea
                          name="jobDescription"
                          value={editedJob.jobDescription || ''}
                          onChange={handleInputChange}
                          rows={6}
                          className={`w-full p-2 rounded-lg resize-y ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200'
                              : 'border border-gray-200'
                          }`}
                        />
                      ) : (
                        <div className={`p-3 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          {selectedJob.jobDescription ? (
                            <p className={`whitespace-pre-line ${textColor}`}>
                              {selectedJob.jobDescription}
                            </p>
                          ) : (
                            <p className={mutedText}>No description provided</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Requirements */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Requirements
                      </label>
                      {isEditMode ? (
                        <textarea
                          name="requirements"
                          value={editedJob.requirements || ''}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Enter job requirements, one per line"
                          className={`w-full p-2 rounded-lg resize-y ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200'
                              : 'border border-gray-200'
                          }`}
                        />
                      ) : (
                        <div className={`p-3 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          {selectedJob.requirements ? (
                            <p className={`whitespace-pre-line ${textColor}`}>
                              {(() => {
                                try {
                                  const arr = JSON.parse(selectedJob.requirements);
                                  if (Array.isArray(arr)) return arr.join(', ');
                                } catch {
                                  return selectedJob.requirements;
                                }
                                return selectedJob.requirements;
                              })()}
                            </p>
                          ) : (
                            <p className={mutedText}>No requirements listed</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Responsibilities */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Responsibilities
                      </label>
                      {isEditMode ? (
                        <textarea
                          name="responsibilities"
                          value={editedJob.responsibilities || ''}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Enter job responsibilities, one per line"
                          className={`w-full p-2 rounded-lg resize-y ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200'
                              : 'border border-gray-200'
                          }`}
                        />
                      ) : (
                        <div className={`p-3 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          {selectedJob.responsibilities ? (
                            <p className={`whitespace-pre-line ${textColor}`}>
                              {(() => {
                                try {
                                  const arr = JSON.parse(selectedJob.responsibilities);
                                  if (Array.isArray(arr)) return arr.join(', ');
                                } catch {
                                  return selectedJob.responsibilities;
                                }
                                return selectedJob.responsibilities;
                              })()}
                            </p>
                          ) : (
                            <p className={mutedText}>No responsibilities listed</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Benefits */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Benefits
                      </label>
                      {isEditMode ? (
                        <textarea
                          name="benefits"
                          value={editedJob.benefits || ''}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Enter job benefits, one per line"
                          className={`w-full p-2 rounded-lg resize-y ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200'
                              : 'border border-gray-200'
                          }`}
                        />
                      ) : (
                        <div className={`p-3 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          {selectedJob.benefits ? (
                            <p className={`whitespace-pre-line ${textColor}`}>
                              {(() => {
                                try {
                                  const arr = JSON.parse(selectedJob.benefits);
                                  if (Array.isArray(arr)) return arr.join(', ');
                                } catch {
                                  return selectedJob.benefits;
                                }
                                return selectedJob.benefits;
                              })()}
                            </p>
                          ) : (
                            <p className={mutedText}>No benefits listed</p>
                          )}
                        </div>
                      )}
                    </div>  

                    {/* Company Description */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Company Description
                      </label>
                      {isEditMode ? (
                        <textarea
                          name="companyDescription"
                          value={editedJob.companyDescription || ''}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full p-2 rounded-lg resize-y ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-gray-200'
                              : 'border border-gray-200'
                          }`}
                        />
                      ) : (
                        <div className={`p-3 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          {selectedJob.companyDescription ? (
                            <p className={`whitespace-pre-line ${textColor}`}>
                              {selectedJob.companyDescription}
                            </p>
                          ) : (
                            <p className={mutedText}>No company description provided</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                {isEditMode && (
                  <div className={`sticky bottom-0 z-10 flex justify-end items-center p-4 ${
                    cardBg
                  } border-t ${borderColor}`}>
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        setEditedJob(selectedJob);
                      }}
                      className={`mr-2 px-4 py-2 rounded-lg text-sm font-medium ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateJob}
                      disabled={isSubmitting}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${accentBg} text-white ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={`p-6 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p>No job data found.</p>
                <button 
                  onClick={handleCloseModal}
                  className={`mt-4 px-4 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;