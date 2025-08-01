import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ChevronRightIcon, BuildingOfficeIcon, MapPinIcon, CurrencyDollarIcon, CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import JobCard from '../components/JobCard';
import baseURL from '../config/axiosPortConfig';
import { useLocation } from 'react-router-dom';
import AlertCard from '../components/AlertCard';
import { motion } from 'framer-motion';

const salaryRanges = [
  "All Ranges",
  "Below LKR 20,000",
  "LKR 20,000 - LKR 50,000",
  "LKR 50,000 - LKR100,000",
  "LKR 100,000+"
];

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to calculate days ago
const daysAgo = (dateString) => {
  const postedDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - postedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

function JobListings() {
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedJobType, setSelectedJobType] = useState('All Types');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('All Ranges');
  const [showFilters, setShowFilters] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [displayMode, setDisplayMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortOption, setSortOption] = useState('newest');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  
  // For rotating text animation
  const phrases = ["Opportunities", "Careers", "Growth", "Success", "Dreams"];
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % phrases.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const locations = ["All Locations", ...new Set(jobs.map(job => job.jobLocation).filter(location => location && location.trim() !== ''))];
  const jobTypes = ["All Types", ...new Set(jobs.map(job => job.jobType).filter(type => type && type.trim() !== ''))];
  
  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    loadJobs();
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFeaturedJobs(jobs.filter(job => job.featured));
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const loadJobs = useCallback(async () => {
    try {
      const loadJobsResponse = await axios.get(`${baseURL}/api/jobs`);
      if(loadJobsResponse.status == 200) {
        setJobs(loadJobsResponse.data.jobs);
      } else {
        toast.error('Error Loading Jobs');
        console.log(loadJobsResponse.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  }, [jobs]);
  
  // Filter jobs based on search and filter criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())||
      (Array.isArray(job.qualifications) && job.qualifications.some(q => q.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesLocation = selectedLocation === 'All Locations' || job.location === selectedLocation || job.jobLocation === selectedLocation;
    const matchesJobType = selectedJobType === 'All Types' || job.jobType === selectedJobType;
    
    let matchesSalary = selectedSalaryRange === 'All Ranges';
    if (!matchesSalary) {
      const salaryValue = parseFloat(job.salaryRange.toString().replace(/[^\d.]/g, ''));
      
      if (!isNaN(salaryValue)) {
        if (selectedSalaryRange === 'Below LKR 20,000') {
          matchesSalary = salaryValue < 20000;
        } else if (selectedSalaryRange === 'LKR 20,000 - LKR 50,000') {
          matchesSalary = salaryValue >= 20000 && salaryValue <= 50000;
        } else if (selectedSalaryRange === 'LKR 50,000 - LKR100,000') {
          matchesSalary = salaryValue >= 50000 && salaryValue <= 100000;
        } else if (selectedSalaryRange === 'LKR 100,000+') {
          matchesSalary = salaryValue >= 100000;
        }
      }
    }

    return matchesSearch && matchesLocation && matchesJobType && matchesSalary;
  });

  // Helper to parse salary range for sorting
  const parseSalary = (salaryRange) => {
    if (!salaryRange) return { min: 0, max: 0 };
    const clean = salaryRange.replace(/LKR|USD|\$|,|\s/gi, '');
    if (clean.includes('-')) {
      const [min, max] = clean.split('-').map(Number);
      return { min, max };
    } else if (clean.endsWith('+')) {
      const min = Number(clean.replace('+', ''));
      return { min, max: min };
    } else {
      const num = Number(clean);
      return { min: num, max: num };
    }
  };

  // Sort jobs before rendering
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const aSalary = parseSalary(a.salaryRange);
    const bSalary = parseSalary(b.salaryRange);

    if (sortOption === 'newest') {
      return new Date(b.postedDate) - new Date(a.postedDate);
    } else if (sortOption === 'oldest') {
      return new Date(a.postedDate) - new Date(b.postedDate);
    } else if (sortOption === 'salary-high') {
      return bSalary.max - aSalary.max;
    } else if (sortOption === 'salary-low') {
      return aSalary.min - bSalary.min;
    }
    return 0;
  });

  // Always show the latest 10 jobs in the carousel, regardless of filters
  const latestJobs = [...jobs]
    .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
    .slice(0, 10);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('All Locations');
    setSelectedJobType('All Types');
    setSelectedSalaryRange('All Ranges');
  };

  // Function to render skeleton loaders
  const renderSkeletons = (count) => {
    return Array(count).fill().map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    ));
  };

  // Enhanced JobCard component with animation
  const EnhancedJobCard = ({ job }) => {
    const navigate = useNavigate();
    const isNonPaid = job.salaryRange?.toLowerCase() === 'non paid';

    // Generate a subtle background color based on job type
    const getBackgroundColor = () => {
      switch (job.jobType) {
        case 'Full-time':
          return 'bg-gradient-to-br from-white via-green-50 to-green-100/50';
        case 'Part-time':
          return 'bg-gradient-to-br from-white via-purple-50 to-purple-100/50';
        case 'Internship':
          return 'bg-gradient-to-br from-white via-blue-50 to-blue-100/50';
        default:
          return 'bg-gradient-to-br from-white via-gray-50 to-gray-100/50';
      }
    };

    const viewJob = useCallback((id) => {
      if(id) {
        navigate(`/jobs/${id}`, { replace: true });
      }
    }, [navigate]);

    return (
      <div className={`group ${getBackgroundColor()} shadow-lg rounded-xl p-6 hover:shadow-xl hover:shadow-blue-100/50 hover:scale-[1.02] transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-900 transition-colors duration-300">{job.jobName || job.title}</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{job.company}</p>
            </div>
          </div>
          
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium group-hover:scale-105 transition-all duration-300 ${
            job.jobType === 'Full-time' 
              ? 'bg-green-100 text-green-800 group-hover:bg-green-200' 
              : job.jobType === 'Part-time' 
                ? 'bg-purple-100 text-purple-800 group-hover:bg-purple-200'
                : job.jobType === 'Internship'
                  ? 'bg-blue-100 text-blue-800 group-hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-800 group-hover:bg-gray-200'
          }`}>
            {job.jobType}
          </span>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{job.description || job.jobDescription}</p>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 group-hover:bg-blue-50 group-hover:shadow-sm transition-all duration-300">
            <svg className="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium group-hover:text-blue-700 transition-colors duration-300">{job.jobLocation || job.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 group-hover:bg-green-50 group-hover:shadow-sm transition-all duration-300">
            <svg className={`w-4 h-4 mr-2 ${isNonPaid ? 'text-gray-400' : 'text-gray-600'} group-hover:${isNonPaid ? 'text-gray-500' : 'text-green-600'} transition-colors duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className={`${isNonPaid ? 'text-gray-500' : 'text-gray-700 font-medium'} group-hover:${isNonPaid ? 'text-gray-600' : 'text-green-700'} transition-colors duration-300`}>
              {job.salaryRange}
            </span>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={() => viewJob(job.jobId || job.id)}
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
          >
            View Details
            <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  const visibleCount = 3; // Always show 3 jobs

  // Auto-scroll effect
  useEffect(() => {
    if (!latestJobs.length) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev =>
        prev + 1 > latestJobs.length - 3 ? 0 : prev + 1
      );
    }, 3000);
    carouselRef.current = interval;
    return () => clearInterval(interval);
  }, [latestJobs.length]);

  // Manual navigation
  const handlePrev = () => {
    setCarouselIndex(prev =>
      prev - 1 < 0 ? Math.max(latestJobs.length - 3, 0) : prev - 1
    );
  };
  const handleNext = () => {
    setCarouselIndex(prev =>
      prev + 1 > latestJobs.length - 3 ? 0 : prev + 1
    );
  };

  // Pause auto-scroll on hover
  const pauseAutoScroll = () => {
    if (carouselRef.current) clearInterval(carouselRef.current);
  };
  const resumeAutoScroll = () => {
    // handled by useEffect
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" />
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-900 to-black py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="inline-block mb-6"
            >
              <span className="inline-flex items-center px-4 py-1 rounded-full bg-blue-600 bg-opacity-20 text-blue-300 text-sm font-medium">
                Job Opportunities
              </span>
            </motion.div>
            
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-2">
              Find Your Dream <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Career</span>
            </h1>
            
            <div className="h-16 overflow-hidden relative mb-8">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: currentPhrase * -64 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full"
              >
                {phrases.map((phrase, index) => (
                  <h2 key={phrase} className="text-2xl md:text-3xl font-bold h-16 flex items-center justify-center text-blue-300">
                    Discover {phrase}
                  </h2>
                ))}
              </motion.div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Discover exceptional opportunities with leading companies in Sri Lanka. Your next career move is just a click away.
            </motion.p>
          </motion.div>
          
          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="relative rounded-lg shadow-lg">
              <input
                type="text"
                className="w-full rounded-lg border-0 py-4 pl-5 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 text-lg"
                placeholder="Search by job title, company, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content container */}
      <main className="space-y-16 py-12 pb-0">
        {/* Alert Card Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AlertCard />
        </div>

        {/* About Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-10 text-center border border-gray-200">
            <h2 className="text-3xl font-extrabold text-blue-900 mb-8">Empowering Careers, Connecting Talent</h2>
            <div className="prose prose-lg text-gray-700 mx-auto space-y-4">
              <p>
                Since 2019, Gamage Recruiters has been a driving force in Sri Lanka's recruitment industry, bridging the gap between skilled professionals and leading organizations across diverse sectors. With a deep understanding of the evolving job market and a commitment to excellence, we have earned a trusted reputation for matching the right talent with the right opportunities.
              </p>
              <p>
                We don't just help you find a job — we help you shape your career. Whether you're a fresh graduate looking for your first step, a professional seeking career advancement, or someone transitioning into a new field, our experienced recruitment team is here to guide you every step of the way. From resume building and interview preparation to onboarding and post-placement support, we provide comprehensive services designed to ensure your long-term success.
              </p>
              <p>
                With a strong presence in emerging markets and an extensive network of employers, we are proud to support equal opportunity, diversity, and inclusive hiring practices. Our proven track record, rapid placement process, and tailored solutions make us the go-to recruitment partner for thousands of job seekers and hundreds of companies. Join the Gamage Recruiters community today and discover opportunities that align with your goals, passions, and potential. Let us help you take the next step in your professional journey — with confidence and purpose.
              </p>  
            </div>
          </div>
        </section>

        {/* Job Carousel Section */}
        {latestJobs.length > 0 && (
          <div className="w-full mt-8 relative flex items-center justify-center">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-0 z-10 -translate-x-1/2 top-1/2 -translate-y-1/2 p-3 bg-white border border-gray-200 shadow-md rounded-full hover:bg-gray-100 transition"
              aria-label="Previous"
              style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)' }}
            >
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {/* Carousel Content */}
            <div className="bg-white py-8 mb-8 rounded-lg shadow-sm border border-gray-100 max-w-7xl w-full mx-auto px-6 lg:px-8 overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{
                  width: '100%',
                  transform: `translateX(-${carouselIndex * (100 / 3)}%)`
                }}
                onMouseEnter={pauseAutoScroll}
                onMouseLeave={resumeAutoScroll}
              >
                {latestJobs.map((job, idx) => (
                  <div
                    key={job.jobId || idx}
                    className="px-3"
                    style={{ minWidth: '33.3333%', maxWidth: '33.3333%', flex: '0 0 33.3333%' }}
                  >
                    <div className="bg-gradient-to-tr from-blue-100 to-white rounded-2xl h-full p-0.5">
                      <EnhancedJobCard job={job} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-0 z-10 translate-x-1/2 top-1/2 -translate-y-1/2 p-3 bg-white border border-gray-200 shadow-md rounded-full hover:bg-gray-100 transition"
              aria-label="Next"
              style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)' }}
            >
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Featured jobs section */}
        {featuredJobs.length > 0 && !isLoading && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white py-8 px-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Opportunities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredJobs.map(job => (
                  <Link key={job.id} to={`/jobs/${job.id}`} className="block">
                    <EnhancedJobCard job={job} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Job listings section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {jobs.length === 0 && !isLoading ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-md border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs available</h3>
                <p className="text-gray-500 mb-6">There are currently no job listings. Please check back later.</p>
              </div>
            ) : (
              <>
                {/* Filters section */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Filter Results</h2>
                    
                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors md:hidden"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <FunnelIcon className="h-5 w-5" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                      </button>
                      
                      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                          className={`p-2 rounded-lg ${displayMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                          onClick={() => setDisplayMode('grid')}
                          title="Grid View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </button>
                        <button
                          className={`p-2 rounded-lg ${displayMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                          onClick={() => setDisplayMode('list')}
                          title="List View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                    <div className="relative">
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-10 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white appearance-none cursor-pointer"
                      >
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        value={selectedJobType}
                        onChange={(e) => setSelectedJobType(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-10 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white appearance-none cursor-pointer"
                      >
                        {jobTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        value={selectedSalaryRange}
                        onChange={(e) => setSelectedSalaryRange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-10 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white appearance-none cursor-pointer"
                      >
                        {salaryRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    
                    <button
                      onClick={clearFilters}
                      className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5 transition-colors shadow-sm"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Results count and sorting */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600">
                    {isLoading ? 'Loading jobs...' : `Showing ${sortedJobs.length} ${sortedJobs.length === 1 ? 'job' : 'jobs'}`}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      className="text-sm border-0 py-2 pl-3 pr-8 text-gray-900 focus:ring-2 focus:ring-blue-600 rounded-lg bg-gray-100 cursor-pointer shadow-sm"
                      value={sortOption}
                      onChange={e => setSortOption(e.target.value)}
                    >
                      <option value="newest" className='cursor-pointer'>Newest First</option>
                      <option value="oldest" className='cursor-pointer'>Oldest First</option>
                      <option value="salary-high" className='cursor-pointer'>Highest Salary</option>
                      <option value="salary-low" className='cursor-pointer'>Lowest Salary</option>
                    </select>
                  </div>
                </div>

                {/* Job listings */}
                {isLoading ? (
                  <div className={`grid ${displayMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {renderSkeletons(6)}
                  </div>
                ) : (
                  <>
                    <div className={`grid ${displayMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                      {sortedJobs.map((job) => (
                        <EnhancedJobCard job={job} key={job.jobId}/>
                      ))}
                    </div>

                    {sortedJobs.length === 0 && (
                      <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No matching jobs found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                        <button 
                          onClick={clearFilters}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Pagination */}
                {filteredJobs.length > 0 && !isLoading && (
                  <div className="mt-12 flex items-center justify-center">
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        aria-current="page"
                        className="relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        1
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        2
                      </button>
                      <button className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">
                        3
                      </button>
                      <button className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Newsletter subscription */}
        <section className="bg-gradient-to-r from-blue-900 to-black py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-white mb-3">Never Miss a Job Opportunity</h2>
                <p className="text-xl text-gray-300">Get personalized job alerts delivered straight to your inbox</p>
              </div>
              <div >
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-grow rounded-lg border-0 py-3 px-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 text-lg"
                  />
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
                    onClick={() => {
                      if (!newsletterEmail) {
                        toast.error('Please enter your email');
                      } else {
                        toast.success('Successfully Subscribed!');
                        setNewsletterEmail('');
                      }
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default memo(JobListings);