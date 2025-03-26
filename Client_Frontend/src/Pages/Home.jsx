import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, MapPin, Briefcase, DollarSign, Calendar, Clock } from 'lucide-react';
import TrustedPartnersSection from '../components/Home/TrustedPartnersSection';
const featuredJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Solutions Ltd",
    location: "Colombo",
    jobType: "Full-time",
    salaryRange: "$3000-$5000",
    description: "Looking for an experienced software engineer to lead our development team.",
    color: "bg-blue-50",
    accent: "border-blue-400"
  },
  {
    id: 2,
    title: "HR Manager",
    company: "Global Enterprises",
    location: "Kandy",
    jobType: "Full-time",
    salaryRange: "$2500-$3500",
    description: "Seeking an experienced HR professional to manage our growing team.",
    color: "bg-emerald-50",
    accent: "border-emerald-400"
  },
  {
    id: 3,
    title: "Marketing Specialist",
    company: "Digital Marketing Pro",
    location: "Galle",
    jobType: "Remote",
    salaryRange: "$2000-$3000",
    description: "Join our dynamic marketing team and help grow our digital presence.",
    color: "bg-purple-50",
    accent: "border-purple-400"
  }
];


const events = [
  {
    id: 1,
    title: "Resume Building Masterclass",
    date: "April 10, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Colombo Innovation Hub",
    category: "Career Development",
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    title: "Tech Industry Networking Event",
    date: "April 17, 2025",
    time: "5:30 PM - 8:30 PM",
    location: "Kingsbury Hotel, Colombo",
    category: "Networking",
    image: "https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 3,
    title: "Leadership Skills Workshop",
    date: "April 24, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Grand Kandy Resort",
    category: "Professional Development",
    image: "https://images.pexels.com/photos/3321797/pexels-photo-3321797.jpeg",
    color: "from-emerald-500 to-teal-600",
  },
];

// Statistics for counter animation
const statistics = [
  { label: "Jobs Available", value: 5000, suffix: "+" },
  { label: "Companies", value: 1200, suffix: "+" },
  { label: "Successful Placements", value: 15000, suffix: "+" },
  { label: "Happy Professionals", value: 25000, suffix: "+" }
];

const TrustedPartners = () => {
  const leftScrollRef = useRef(null);
  const rightScrollRef = useRef(null);

  useEffect(() => {
    const animateLeftScroll = () => {
      if (leftScrollRef.current) {
        if (leftScrollRef.current.scrollLeft >= leftScrollRef.current.scrollWidth / 2) {
          leftScrollRef.current.scrollLeft = 0;
        } else {
          leftScrollRef.current.scrollLeft += 1;
        }
      }
    };

    const animateRightScroll = () => {
      if (rightScrollRef.current) {
        if (rightScrollRef.current.scrollLeft <= 0) {
          rightScrollRef.current.scrollLeft = rightScrollRef.current.scrollWidth / 2;
        } else {
          rightScrollRef.current.scrollLeft -= 1;
        }
      }
    };

    const leftInterval = setInterval(animateLeftScroll, 30);
    const rightInterval = setInterval(animateRightScroll, 30);

    return () => {
      clearInterval(leftInterval);
      clearInterval(rightInterval);
    };
  }, []);
}



export default function Home() {
  // State for animating counter statistics
  const [counters, setCounters] = useState(statistics.map(() => 0));
  const [readmore, setReadmore] = useState(false);

  // State for currently visible featured job
  const [activeJobIndex, setActiveJobIndex] = useState(0);

  // Animation for typing effect
  const [displayText, setDisplayText] = useState("");
  const fullText = "Find Your Dream Career in Sri Lanka";

  // Counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev =>
        prev.map((count, idx) => {
          const target = statistics[idx].value;
          const increment = Math.ceil(target / 40);
          return count + increment >= target ? target : count + increment;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Typing animation
  useEffect(() => {
    if (displayText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.substring(0, displayText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [displayText]);

  // Featured job carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveJobIndex(prev => (prev + 1) % featuredJobs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const partners = [
    { id: 1, name: "CBL", logo: "https://d1l8km4g5s76x5.cloudfront.net/Production/exb_doc/2015/16038/thumb_2015_16038_15864_4687.png", category: "Food & Beverage" },
    { id: 2, name: "Global Finance", logo: "data:image/png;base64,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", category: "Finance" },
    { id: 3, name: "Health Plus", logo: "https://www.hac.lk/uploads/brand/pelwatte-LSrs5cqkat.png", category: "Healthcare" },
    { id: 4, name: "Edu Alliance", logo: "https://upload.wikimedia.org/wikipedia/en/0/0a/Union_Assurance_logo.png", category: "Education" },
    { id: 5, name: "Build Masters", logo: "https://i.ibb.co/pvn864CX/image.png", category: "Construction" },
    { id: 6, name: "Tech Innovate", logo: "https://d1l8km4g5s76x5.cloudfront.net/Production/exb_doc/2015/16038/thumb_2015_16038_15864_4687.png", category: "Technology" },
    { id: 7, name: "Green Energy", logo: "https://www.hac.lk/uploads/brand/pelwatte-LSrs5cqkat.png", category: "Energy" },
    { id: 8, name: "Urban Living", logo: "https://upload.wikimedia.org/wikipedia/en/0/0a/Union_Assurance_logo.png", category: "Real Estate" }
  ];

  const testimonials = [
    {
      name: "Damayantha Surampika",
      role: "Senior Marketing Executive",
      company: "Gamage Recruiters",
      quote: "I am beyond grateful to Gamage Recruiters for connecting me with the perfect career opportunity. Their guidance and support helped me secure a role as a Senior Marketing Executive at a reputed firm, where I can truly showcase my skills. The recruitment team understood my strengths and aspirations, making the entire process smooth and stress-free. Thank you for paving the way for my professional growth!",
      image: "/api/placeholder/100/100"
    },
    {
      name: "Nehara Sampath",
      role: "Business Analyst",
      company: "Gamage Recruiters",
      quote: "Gamage Recruiters played a crucial role in my career transition by helping me secure a position as a Business Analyst. Their recruitment process was seamless, and they took the time to understand my career goals. I am now working at a company that challenges and excites me every day. Thank you for making this possible!",
      image: "/api/placeholder/100/100"
    },
    {
      name: "Isuru Dananjaya",
      role: "Operations Manager",
      company: "Gamage Recruiters",
      quote: "I sincerely appreciate Gamage Recruiters for helping me take a major step forward in my career. With their assistance, I secured an Operations Manager role at a leading company, and I couldn’t be happier with the growth opportunities. Their professionalism and commitment to job seekers are truly commendable. Thank you for making a difference in my career!",
      image: "/api/placeholder/100/100"
    },
  ]

  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section with Parallax */}
      <div className="relative isolate overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black opacity-90"></div>
        <video
          className="absolute inset-0 w-full h-full object-cover brightness-[0.15] scale-110 transform"
          autoPlay
          loop
          muted
          playsInline
          src="https://videos.pexels.com/video-files/7989708/7989708-hd_1920_1080_25fps.mp4"
        />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 sm:py-32 lg:px-8 text-center">
          <div
            className="max-w-3xl transform transition-all duration-1000 translate-y-0 opacity-100"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl mb-6">
              {displayText}
              <span className="animate-pulse">|</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-300 font-light">
              Connect with top employers and opportunities across Sri Lanka. Let us help you take the next step in your professional journey.
            </p>

            {/* Animated Search Bar */}
            <div className="mt-10 mx-auto max-w-2xl">
              <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-full p-2 border border-white border-opacity-20 transition-all duration-500 hover:bg-opacity-20">
                <input
                  type="text"
                  placeholder="Search for jobs, skills, or companies..."
                  className="flex-1 bg-transparent text-white border-none outline-none px-4 py-2"
                />
                <button className="bg-white text-indigo-900 rounded-full px-6 py-2 font-semibold transform transition duration-300 hover:scale-105">
                  Search
                </button>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/jobs"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-900 shadow-lg hover:shadow-indigo-500/20 transform transition duration-300 hover:scale-105"
              >
                Browse Jobs
              </Link>
              <Link
                to="/about"
                className="text-sm font-semibold leading-6 text-white group flex items-center"
              >
                Learn more
                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Animated Statistics */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full max-w-5xl">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-10 transform transition duration-500 hover:scale-105 hover:bg-opacity-10">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {counters[index].toLocaleString()}{stat.suffix}
                </div>
                <div className="text-gray-300 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated background elements */}
        <div className="hidden md:block absolute top-20 left-10 w-32 h-32 bg-indigo-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="hidden md:block absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>




      {/* Featured Jobs Section with Card Animation */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Featured Opportunities
            </span>
          </h2>
          <p className="mt-4 text-xl leading-8 text-gray-600">
            Discover opportunities that match your skills and aspirations
          </p>
        </div>

        <div className="mx-auto grid max-w-full grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-3">
          {featuredJobs.map((job, index) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className={`group transform transition-all duration-500 hover:-translate-y-2 ${index === activeJobIndex ? 'scale-105 shadow-xl' : 'scale-100 shadow-md'
                }`}
            >
              <div className={`flex flex-col h-full ${job.color} border-l-4 ${job.accent} rounded-lg overflow-hidden`}>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                      {job.title}
                    </h3>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-white text-indigo-600 border border-indigo-100">
                      {job.jobType}
                    </span>
                  </div>

                  <p className="text-base font-medium text-indigo-600 mb-4">{job.company}</p>
                  <p className="text-base text-gray-600 mb-6 flex-grow">{job.description}</p>

                  <div className="mt-auto grid grid-cols-2 gap-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign size={16} className="mr-1 text-gray-400" />
                      {job.salaryRange}
                    </div>
                  </div>
                </div>

                <div className="px-8 py-4 bg-white border-t border-gray-100 group-hover:bg-indigo-50 transition-colors duration-300">
                  <div className="flex items-center text-indigo-600 font-medium">
                    View details
                    <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 shadow-md hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg"
          >
            View All Jobs <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Trusted Partners Section */}
      <TrustedPartnersSection />

      {/* Workshops and Seminars Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Workshops & Seminars
              </span>
            </h2>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
              Enhance your skills and expand your professional network with our exclusive events
            </p>
          </div>

          <div className="mx-auto grid max-w-full grid-cols-1 gap-8 md:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="group relative overflow-hidden rounded-xl shadow-lg transform transition duration-500 hover:-translate-y-2 hover:shadow-xl">
                <div className={`absolute inset-0 bg-gradient-to-r ${event.color} opacity-80 z-10`}></div>
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-64 w-full object-cover transform transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold inline-block w-fit mb-2">
                    {event.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center text-sm mb-1">
                    <Calendar size={16} className="mr-1" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm mb-1">
                    <Clock size={16} className="mr-1" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin size={16} className="mr-1" />
                    {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/workshop"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
            >
              View All Events <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>


      {/* Testimonials Section (New) */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Success Stories
            </h2>
            <p className="mt-4 text-xl leading-8 text-gray-600">
              Hear from professionals who found their dream careers through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {
              testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-8 transform transition duration-500 hover:-translate-y-2 hover:shadow-xl border border-gray-100">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-indigo-600">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>

                  {readmore === false ? (
                    <p className="text-gray-600 italic line-clamp-4">"{testimonial.quote}"</p>
                  ) :
                    (<p className="text-gray-600 italic">"{testimonial.quote}"</p>

                    )}
                  {readmore === false ? (
                    <div className="flex items-center text-indigo-600 font-medium" onClick={() => setReadmore(true)} style={{ cursor: 'pointer' }} >
                      Read more ...
                    </div>
                  ) : (
                    <div className="flex items-center text-indigo-600 font-medium" onClick={() => setReadmore(false)} style={{ cursor: 'pointer' }} >
                      Read less ...
                    </div>
                  )}

                </div>
              ))}
          </div>
        </div>
      </div>

      {/* CTA Section with Parallax and Animation */}
      <div className="relative bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-800 to-indigo-900"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNGMwIDIuMjEtMS43OSA0LTQgNHMtNC0xLjc5LTQtNG0wLTE3YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDRjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTRNMTcgMTdjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNGMwIDIuMjEtMS43OSA0LTQgNHMtNC0xLjc5LTQtNG0wIDE3YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDRjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to Transform Your Career?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-xl leading-8 text-indigo-100">
              Join thousands of professionals who've found their perfect career match through Gamage Recruiters
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-y-4 gap-x-6">
              <Link
                to="/login"
                className="w-full sm:w-auto rounded-full bg-white px-8 py-4 text-base font-semibold text-indigo-700 shadow-lg hover:bg-indigo-50 transform transition duration-300 hover:scale-105"
              >
                Create Your Profile
              </Link>
              <Link
                to="/employers"
                className="w-full sm:w-auto rounded-full bg-indigo-700 px-8 py-4 text-base font-semibold text-white shadow-lg border border-indigo-500 hover:bg-indigo-600 transform transition duration-300 hover:scale-105"
              >
                For Employers
              </Link>
            </div>

            <div className="mt-6">
              <Link
                to="/contact"
                className="text-base font-medium text-indigo-100 hover:text-white transition-colors flex items-center justify-center"
              >
                Have questions? Contact our team <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>

          {/* Mobile App Promo */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="bg-indigo-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Take Your Job Search On The Go</h3>
                  <p className="text-indigo-100 mb-6">
                    Download our mobile app to get instant notifications about new job opportunities that match your profile.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button className="bg-black text-white rounded-lg px-6 py-3 flex items-center justify-center transform transition hover:scale-105">
                      <span className="mr-2">▶</span>
                      <span>
                        <span className="block text-xs">Download on the</span>
                        <span className="block text-sm font-semibold">App Store</span>
                      </span>
                    </button>
                    <button className="bg-black text-white rounded-lg px-6 py-3 flex items-center justify-center transform transition hover:scale-105">
                      <span className="mr-2">▶</span>
                      <span>
                        <span className="block text-xs">GET IT ON</span>
                        <span className="block text-sm font-semibold">Google Play</span>
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="relative w-64 h-96">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-3xl transform rotate-2"></div>
                    <div className="absolute inset-2 bg-black rounded-3xl overflow-hidden">
                      <img
                        src="/api/placeholder/300/600"
                        alt="Mobile app screenshot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}