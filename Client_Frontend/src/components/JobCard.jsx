export default function JobCard({ job }) {
  const isNonPaid = job.salaryRange?.toLowerCase() === 'non paid';

  // Generate a subtle background color based on job type
  const getBackgroundColor = () => {
    switch (job.jobType) {
      case 'Full-time':
        return 'bg-gradient-to-br from-white via-blue-50 to-blue-100/50';
      case 'Part-time':
        return 'bg-gradient-to-br from-white via-purple-50 to-purple-100/50';
      case 'Internship':
        return 'bg-gradient-to-br from-white via-blue-50 to-blue-100/50';
      default:
        return 'bg-gradient-to-br from-white via-gray-50 to-gray-100/50';
    }
  };
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
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-900 transition-colors duration-300">{job.title}</h3>
            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{job.company}</p>
          </div>
        </div>
        
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium group-hover:scale-105 transition-all duration-300 ${
          job.jobType === 'Full-time' 
            ? 'bg-blue-100 text-blue-800 group-hover:bg-blue-200' 
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
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{job.description}</p>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 group-hover:bg-blue-50 group-hover:shadow-sm transition-all duration-300">
          <svg className="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium group-hover:text-blue-700 transition-colors duration-300">{job.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 group-hover:bg-blue-50 group-hover:shadow-sm transition-all duration-300">
          <svg className={`w-4 h-4 mr-2 ${isNonPaid ? 'text-gray-400' : 'text-gray-600'} group-hover:${isNonPaid ? 'text-gray-500' : 'text-blue-600'} transition-colors duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className={`${isNonPaid ? 'text-gray-500' : 'text-gray-700 font-medium'} group-hover:${isNonPaid ? 'text-gray-600' : 'text-blue-700'} transition-colors duration-300`}>
            {job.salaryRange}
          </span>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={() => window.location.href = `/jobs/${job.id}`}
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
}