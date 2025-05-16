import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ChevronRightIcon, BuildingOfficeIcon, MapPinIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import JobCard from '../components/JobCard';
import baseURL from '../config/axiosPortConfig';

// Mock data - will be replaced with actual API calls
// const jobs = [
//   {
//     id: 1,
//     title: "Senior Software Engineer",
//     company: "Tech Solutions Ltd",
//     location: "Colombo",
//     jobType: "Full-time",
//     salaryRange: "$3000-$5000",
//     description: "Looking for an experienced software engineer to lead our development team.",
//     qualifications: ["5+ years experience", "Bachelor's degree", "Strong leadership skills"],
//     postedDate: "2023-09-15",
//     featured: true,
//     logo: "https://placehold.co/400"
//   },
//   {
//     id: 2,
//     title: "HR Manager",
//     company: "Global Enterprises",
//     location: "Kandy",
//     jobType: "Full-time",
//     salaryRange: "$2500-$3500",
//     description: "Seeking an experienced HR professional to manage our growing team.",
//     qualifications: ["4+ years HR experience", "Master's degree preferred"],
//     postedDate: "2023-09-14",
//     featured: false,
//     logo: "https://placehold.co/400"
//   },
//   {
//     id: 3,
//     title: "Marketing Specialist",
//     company: "Digital Marketing Pro",
//     location: "Galle",
//     jobType: "Remote",
//     salaryRange: "$2000-$3000",
//     description: "Join our dynamic marketing team and help grow our digital presence.",
//     qualifications: ["3+ years marketing experience", "Digital marketing certification"],
//     postedDate: "2023-09-13",
//     featured: false,
//     logo: "https://placehold.co/400"
//   },
//   {
//     id: 4,
//     title: "Frontend Developer",
//     company: "WebTech Solutions",
//     location: "Colombo",
//     jobType: "Contract",
//     salaryRange: "$2500-$4000",
//     description: "Frontend developer needed for exciting web projects.",
//     qualifications: ["React expertise", "3+ years experience"],
//     postedDate: "2023-09-12",
//     featured: true,
//     logo: "https://placehold.co/400"
//   },
//   {
//     id: 5,
//     title: "Business Analyst",
//     company: "Finance Corp",
//     location: "Colombo",
//     jobType: "Full-time",
//     salaryRange: "$2800-$3800",
//     description: "Business analyst needed for our expanding finance team.",
//     qualifications: ["Finance background", "Strong analytical skills"],
//     postedDate: "2023-09-11",
//     featured: false,
//     logo: "https://placehold.co/400"
//   }
// ];

const locations = ["All Locations", "Colombo", "Kandy", "Galle", "Remote"];
const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Remote"];
const salaryRanges = [
  "All Ranges",
  "Below $2000",
  "$2000-$3000",
  "$3000-$4000",
  "$4000+"
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedJobType, setSelectedJobType] = useState('All Types');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('All Ranges');
  const [showFilters, setShowFilters] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [displayMode, setDisplayMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  
  useEffect(() => {
    loadJobs();
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Set featured jobs
      setFeaturedJobs(jobs.filter(job => job.featured));
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const loadJobs =  useCallback(async () => {
      try {
        const loadJobsResponse = await axios.get(`${baseURL}/api/jobs`);
        console.log(loadJobsResponse.data);
        if(loadJobsResponse.status == 200) {
          console.log('Jobs loaded successfully');
          console.log(loadJobsResponse.data.jobs);
          setJobs(loadJobsResponse.data.jobs);
        } else {
          toast.error('Error Loading Jobs');
          console.log(loadJobsResponse.statusText);
          return;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }, [jobs]);
  
  // Filter jobs based on search and filter criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = selectedLocation === 'All Locations' || job.location === selectedLocation;
    const matchesJobType = selectedJobType === 'All Types' || job.jobType === selectedJobType;
    
    // Implement proper salary range filtering
    let matchesSalary = selectedSalaryRange === 'All Ranges';
    if (!matchesSalary) {
      const salary = {
        min: parseInt(job.salaryRange.split('-')[0].replace('$', '').replace('+', '')),
        max: job.salaryRange.includes('+') ? 100000 : parseInt(job.salaryRange.split('-')[1]?.replace('$', '') || 0)
      };
      
      if (selectedSalaryRange === 'Below $2000') {
        matchesSalary = salary.min < 2000;
      } else if (selectedSalaryRange === '$2000-$3000') {
        matchesSalary = (salary.min >= 2000 && salary.min <= 3000) || (salary.max >= 2000 && salary.max <= 3000);
      } else if (selectedSalaryRange === '$3000-$4000') {
        matchesSalary = (salary.min >= 3000 && salary.min <= 4000) || (salary.max >= 3000 && salary.max <= 4000);
      } else if (selectedSalaryRange === '$4000+') {
        matchesSalary = salary.min >= 4000 || salary.max >= 4000;
      }
    }

    return matchesSearch && matchesLocation && matchesJobType && matchesSalary;
  });

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
      <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 animate-pulse">
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

    const viewJob = useCallback((id) => {
      console.log(id);

      if(id) {
        navigate(`/jobs/${id}`, { replace: true });
      }
    }, [navigate]);

    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 relative group">
        {job.featured && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
            Featured
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 cursor-pointer" onClick={() => viewJob(job.jobId)}>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors duration-300">{job.jobName}</h3>
            <p className="text-sm font-medium text-gray-600">{job.company}</p>
            
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                <MapPinIcon className="w-3 h-3 mr-1" />
                {job.location}
              </span>
              <span className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {job.jobType}
              </span>
              <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                <CurrencyDollarIcon className="w-3 h-3 mr-1" />
                {job.salaryRange}
              </span>
            </div>
            
            <p className="mt-3 text-sm text-gray-500 line-clamp-2">{job.description}</p>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500 flex items-center">
                <CalendarIcon className="w-3 h-3 mr-1" />
                Posted {daysAgo(job.postedDate)} days ago
              </span>
              <span className="text-sm font-medium text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                View Details <ChevronRightIcon className="w-4 h-4 ml-1" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer/>
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-blue-900 to-black py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Find Your Dream Career
          </h1>
          <p className="mt-3 text-lg text-gray-300 max-w-xl">
            Discover exceptional opportunities with leading companies in Sri Lanka. Your next career move is just a click away.
          </p>
          
          {/* Main search box */}
          <div className="mt-8 max-w-2xl">
            <div className="relative rounded-lg shadow-lg">
              <input
                type="text"
                className="w-full rounded-lg border-0 py-3 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="Search by job title, company, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured jobs section */}
      {featuredJobs.length > 0 && !isLoading && (
        <div className="bg-white py-8 border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredJobs.map(job => (
                <Link key={job.id} to={`/jobs/${job.id}`} className="block">
                  <EnhancedJobCard job={job} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        {/* Filters section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filter Results</h2>
            
            <button
              className="flex items-center gap-2 text-sm font-medium text-gray-700 md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-5 w-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <div className="flex gap-2">
              <button
                className={`p-2 rounded ${displayMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
                onClick={() => setDisplayMode('grid')}
                title="Grid View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                className={`p-2 rounded ${displayMode === 'list' ? 'bg-gray-200' : 'bg-white'}`}
                onClick={() => setDisplayMode('list')}
                title="List View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className={`flex flex-col md:flex-row gap-4 ${showFilters ? 'block' : 'hidden md:flex'}`}>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600"
            >
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedSalaryRange}
              onChange={(e) => setSelectedSalaryRange(e.target.value)}
              className="rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600"
            >
              {salaryRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
            
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <XMarkIcon className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results count and sorting */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            {isLoading ? 'Loading jobs...' : `Showing ${filteredJobs.length} jobs`}
          </p>
          
          <select
            className="text-sm border-0 py-1 pl-2 pr-8 text-gray-900 focus:ring-0 cursor-pointer"
            defaultValue="newest"
          >
            <option value="newest" className='cursor-pointer'>Newest First</option>
            <option value="oldest" className='cursor-pointer'>Oldest First</option>
            <option value="salary-high" className='cursor-pointer'>Highest Salary</option>
            <option value="salary-low" className='cursor-pointer'>Lowest Salary</option>
          </select>
        </div>

        {/* Job listings */}
        {isLoading ? (
          <div className={`grid ${displayMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {renderSkeletons(6)}
          </div>
        ) : (
          <>
            <div className={`grid ${displayMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {filteredJobs.map((job) => (
                <EnhancedJobCard job={job} key={job.jobId}/>
                // <Link key={job.jobId} to={`/jobs/:${job.jobId}`} className="block">
                //   <EnhancedJobCard job={job} />
                // </Link>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No matching jobs found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                <button 
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {filteredJobs.length > 0 && !isLoading && (
          <div className="mt-8 flex items-center justify-center">
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <a href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" aria-current="page" className="relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">1</a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">2</a>
              <a href="#" className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">3</a>
              <a href="#" className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
        )}
      </div>

      {/* Newsletter subscription */}
      <div className="bg-gradient-to-r from-blue-900 to-black py-12 mt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0 md:w-1/2">
            <h2 className="text-2xl font-bold text-white mb-2">Never Miss a Job Opportunity</h2>
            <p className="text-gray-300">Get personalized job alerts delivered straight to your inbox</p>
          </div>
          <div className="md:w-1/2">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow rounded-lg border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(JobListings);