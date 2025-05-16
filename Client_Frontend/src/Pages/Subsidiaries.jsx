import React, { useState, useEffect, useRef, memo } from 'react';
import { MapPin, Mail, Phone, ArrowRight, GraduationCap, Briefcase, Award, Calendar, Clock, Users, Wine, Ship, BookOpen, Globe, Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Subsidiaries() {
  // State for animations and interactions
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('dutyfree');
  const [isVisible, setIsVisible] = useState({
    hero: false,
    dutyfree: false,
    campus: false,
    stats: false
  });
  const [counters, setCounters] = useState({
    students: 0,
    courses: 0,
    partners: 0,
    countries: 0
  });
  
  // Refs for intersection observer
  const heroRef = useRef(null);
  const dutyfreeRef = useRef(null);
  const campusRef = useRef(null);
  const statsRef = useRef(null);
  const navigate = useNavigate();
  
  // Counter final values
  const counterTargets = {
    students: 1000,
    courses: 35,
    partners: 25,
    countries: 15
  };
  
  // Mouse position for 3D hover effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  
  
  useEffect(() => {
    // Scroll handler
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    

    // Mouse move handler for 3D card effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    // Set up intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) setIsVisible(prev => ({ ...prev, hero: true }));
            if (entry.target === dutyfreeRef.current) setIsVisible(prev => ({ ...prev, dutyfree: true }));
            if (entry.target === campusRef.current) setIsVisible(prev => ({ ...prev, campus: true }));
            if (entry.target === statsRef.current) setIsVisible(prev => ({ ...prev, stats: true }));
          }
        });
      },
      { threshold: 0.2 }
    );
    
    // Observe elements
    if (heroRef.current) observer.observe(heroRef.current);
    if (dutyfreeRef.current) observer.observe(dutyfreeRef.current);
    if (campusRef.current) observer.observe(campusRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    
    // Set up event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Counter animation
    let interval;
    if (isVisible.stats) {
      interval = setInterval(() => {
        setCounters(prev => {
          const newCounters = { ...prev };
          let allComplete = true;
          
          Object.keys(counterTargets).forEach(key => {
            if (prev[key] < counterTargets[key]) {
              const step = Math.ceil(counterTargets[key] / 50);
              newCounters[key] = Math.min(prev[key] + step, counterTargets[key]);
              allComplete = false;
            }
          });
          
          if (allComplete) clearInterval(interval);
          return newCounters;
        });
      }, 50);
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (interval) clearInterval(interval);
      observer.disconnect();
    };
  }, [isVisible.stats]);
  
  // 3D transform style based on mouse position
  const get3DTransform = () => {
    const rotateX = (mousePosition.y - 0.5) * 10;
    const rotateY = (mousePosition.x - 0.5) * 10;
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none z-0">
        <div className="absolute w-full h-full">
          {/* Animated gradient mesh */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-3/4 left-1/3 w-1/3 h-1/3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/3 right-1/4 w-1/4 h-1/4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
          </div>
        </div>
      </div>

      {/* Hero Section with Parallax */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-indigo-950 text-white">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-indigo-950"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full grid grid-cols-8 gap-0">
            {Array(8).fill().map((_, i) => (
              <div key={i} className="border-r border-white h-full"></div>
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-8 gap-0">
            {Array(8).fill().map((_, i) => (
              <div key={i} className="border-b border-white w-full"></div>
            ))}
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array(20).fill().map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                height: `${Math.random() * 10 + 5}px`,
                width: `${Math.random() * 10 + 5}px`,
                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Hero content */}
        <div 
          ref={heroRef}
          className={`relative z-10 max-w-6xl mx-auto px-6 text-center transition-all duration-1000 transform ${
            isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Sparkles className="inline-block mb-6 text-blue-400" size={48} />
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8">
            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">Subsidiaries</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-indigo-200 max-w-3xl mx-auto mb-12">
            Discover our diverse portfolio of companies dedicated to excellence in retail and education.
          </p>
          
          {/* Navigation tabs */}
          
          
          {/* Scroll indicator */}
          
        </div>
      </div>

      {/* Duty Free Section */}
      <div 
        ref={dutyfreeRef}
        id="dutyfree-section"
        className={`py-24 sm:py-32 relative transition-all duration-1000 transform ${
          isVisible.dutyfree ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 p-2 mb-4">
              <Wine className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Veritas International <span className="text-indigo-600">(PVT) Ltd</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Premium duty-free wine store located in the prestigious Colombo Port
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image card with 3D effect */}
            <div 
              className="relative group perspective-1000"
              style={{ transform: isVisible.dutyfree ? get3DTransform() : 'none' }}
            >
              <div className="absolute -inset-px bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative h-96 overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 mix-blend-multiply z-10"></div>
                <img 
                  src="https://iili.io/3gXzoa2.jpg" 
                  alt="Premium Wine Store" 
                  className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-20"></div>
                
                {/* Floating elements */}
                <div className="absolute top-6 right-6 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 z-30 flex items-center">
                  <Ship className="text-white mr-2" size={18} />
                  <span className="text-white text-sm font-medium">Port Location</span>
                </div>
                
                <div className="absolute bottom-0 inset-x-0 p-8 z-30">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1 text-sm text-white">Premium Selection</span>
                    <span className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1 text-sm text-white">Imported Wines</span>
                    <span className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1 text-sm text-white">Tax-Free</span>
                  </div>
                </div>
              </div>
              
              {/* Animated badge */}
              <div className="absolute -top-5 -right-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full shadow-lg transform rotate-12 animate-pulse">
                Exclusive Selection
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-lg text-gray-600">
                  Experience our exclusive duty-free wine store at Colombo Port, offering a curated selection of premium wines and spirits from around the world. Perfect for travelers seeking quality beverages at competitive prices.
                </p>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-medium">Location</span>
                      <p className="text-gray-600">Colombo Port, Sri Lanka</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-medium">Contact</span>
                      <p className="text-gray-600">0716464746</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Photo Gallery - New Addition */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img 
                    src="https://iili.io/3gXzoa2.jpg" 
                    alt="Veritas Wine Collection" 
                    className="h-40 w-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img 
                    src="https://iili.io/3gXzn3l.jpg" 
                    alt="Premium Wine Selection" 
                    className="h-40 w-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img 
                    src="https://iili.io/3gXzB44.jpg" 
                    alt="Exclusive Wine Varieties" 
                    className="h-40 w-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <Wine className="h-8 w-8 text-indigo-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Premium Selections</h3>
                  <p className="text-gray-600">Curated collection of fine wines and spirits from renowned vineyards worldwide.</p>
                </div>
                
                <div className="bg-white rounded-xl border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <Star className="h-8 w-8 text-indigo-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Duty-Free Benefits</h3>
                  <p className="text-gray-600">Enjoy tax-free shopping with competitive pricing exclusive to our port location.</p>
                </div>
              </div>
              
             
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative wave separator */}
      <div className="relative h-24 overflow-hidden">
        <svg className="absolute w-full h-24" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24.9999C240 74.9999 480 0.000061 720 0C960 -0.000061 1200 74.9999 1440 24.9999V74H0V24.9999Z" fill="#EEF2FF"/>
        </svg>
      </div>

      {/* Campus Section */}
      <div 
        ref={campusRef}
        id="campus-section"
        className={`py-24 sm:py-32 bg-indigo-50 relative transition-all duration-1000 transform ${
          isVisible.campus ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 p-2 mb-4">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              VERITAS International <span className="text-indigo-600">Campus </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Shaping future-ready individuals through academic excellence, innovation, and real-world relevance
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-lg text-gray-600">
                  As a bold and passionate start-up in higher education, we are committed to nurturing future-ready professionals through a blend of academic excellence, innovative teaching approaches, and industry-relevant curriculum.
                </p>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-medium">Email</span>
                      <p className="text-gray-600">info.veritascampus@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-medium">Contact</span>
                      <p className="text-gray-600">0777897901 | 0774795371</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div ref={statsRef} className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Users className="h-6 w-6 text-indigo-600" />, value: counters.students, label: "Students", suffix: "+" },
                  { icon: <BookOpen className="h-6 w-6 text-indigo-600" />, value: counters.courses, label: "Courses", suffix: "+" },
                  { icon: <Briefcase className="h-6 w-6 text-indigo-600" />, value: counters.partners, label: "Partners", suffix: "+" },
                  { icon: <Globe className="h-6 w-6 text-indigo-600" />, value: counters.countries, label: "Countries", suffix: "+" }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl border border-indigo-100 p-4 shadow-sm flex items-center space-x-4">
                    <div className="bg-indigo-50 p-3 rounded-full">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{item.value}{item.suffix}</div>
                      <p className="text-gray-500 text-sm">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 pt-4">Our Programs</h3>
              
              <div className="space-y-4">
                {[
                  { 
                    icon: <BookOpen className="h-5 w-5 text-indigo-600" />, 
                    title: "Undergraduate Programs", 
                    desc: "Business, Marketing, Technology, and more" 
                  },
                  { 
                    icon: <Award className="h-5 w-5 text-indigo-600" />, 
                    title: "Professional Diplomas", 
                    desc: "HR, Business Management, and Marketing" 
                  },
                  { 
                    icon: <Calendar className="h-5 w-5 text-indigo-600" />, 
                    title: "Workshops & Skill Development", 
                    desc: "Focusing on real-world skills" 
                  },
                  { 
                    icon: <Clock className="h-5 w-5 text-indigo-600" />, 
                    title: "Internships & Placement", 
                    desc: "Opportunities to enhance career prospects" 
                  }
                ].map((program, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl border border-indigo-100 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-1 transform"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-50 p-2 rounded-lg">
                        {program.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{program.title}</h4>
                        <p className="text-sm text-gray-600">{program.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-8 py-4 font-bold text-white transition-all duration-300 hover:bg-indigo-700">
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                <span className="relative flex items-center">
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </div>
            
            {/* Images with 3D effect - Now with two photos */}
            <div className="order-first lg:order-last space-y-6">
              {/* First image */}
              <div 
                className="relative group perspective-1000"
                style={{ transform: isVisible.campus ? get3DTransform() : 'none' }}
              >
                <div className="absolute -inset-px bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative h-72 overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 mix-blend-multiply z-10"></div>
                  <img 
                    src="https://blog.unemployedprofessors.com/wp-content/uploads/2025/03/DALL%C2%B7E-2025-03-12-20.28.34-A-prestigious-university-library-setting-with-two-contrasting-study-areas.-One-side-shows-students-passively-using-AI-generated-text-on-their-laptops.webp" 
                    alt="Veritas Campus Library" 
                    className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0  z-20"></div>
                  
                  
                </div>
              </div>
              
              {/* Second image - newly added */}
              <div 
                className="relative group perspective-1000"
                style={{ transform: isVisible.campus ? get3DTransform(0.5) : 'none' }}
              >
                <div className="absolute -inset-px bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative h-72 overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 mix-blend-multiply z-10"></div>
                  <img 
                    src="https://iili.io/3gvFonn.png" 
                    alt="Veritas Campus Students" 
                    className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute   z-20"></div>
                  
                  {/* Floating elements */}
                  
                  
                  <div className="absolute bottom-0 inset-x-0 p-8 z-30">
                    
                  </div>
                </div>
              </div>
              
              {/* Animated badge */}
              <div className="absolute -top-5 -right-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full shadow-lg transform -rotate-12 animate-pulse">
                Future Ready
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="relative py-24 bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-80"></div>
        
        {/* Moving particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array(15).fill().map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white opacity-10 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                animation: `float ${Math.random() * 20 + 10}s linear infinite`
              }}
            ></div>
          ))}
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full grid grid-cols-6 gap-0">
            {Array(6).fill().map((_, i) => (
              <div key={i} className="border-r border-white h-full"></div>
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-6 gap-0">
            {Array(6).fill().map((_, i) => (
              <div key={i} className="border-b border-white w-full"></div>
            ))}
          </div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center z-10">
          <Sparkles className="inline-block text-indigo-300 mb-6" size={28} />
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            Ready to Connect With Our Subsidiaries?
          </h2>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto mb-10">
            Whether you're interested in our premium duty-free offerings or educational programs, we're here to help you elevate your experience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-indigo-600 bg-white shadow-md hover:bg-indigo-50 transition-all duration-300 hover:shadow-lg group relative overflow-hidden">
              <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-indigo-100 opacity-30 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
              <span className="relative flex items-center">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
            
            <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-full text-white bg-transparent hover:bg-white/10 transition-all duration-300">
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating action button for navigation */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="relative flex items-center justify-center p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowRight className="h-6 w-6 text-indigo-600 transform -rotate-90" />
          </button>
        </div>
      </div>
      
      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}

export default memo(Subsidiaries);