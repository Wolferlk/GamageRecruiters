import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Staffing and Recruiting',
    description: 'We provide end-to-end recruitment solutions for permanent and contract positions, ensuring businesses find the right talent.',
    features: [
      'Comprehensive candidate screening',
      'Industry-specific expertise',
      'Interview coordination',
      'Offer management',
      'Post-placement support'
    ],
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: 'Interview Preparation',
    description: 'Our expert-led coaching helps candidates succeed in job interviews with tailored strategies and confidence-building techniques.',
    features: [
      'Personalized coaching',
      'Mock interviews with industry experts',
      'Resume and cover letter optimization',
      'Confidence-building strategies'
    ],
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: 'HR Consultancy',
    description: 'We offer strategic HR solutions to enhance organizational effectiveness and improve workforce management.',
    features: [
      'HR policy development',
      'Performance management systems',
      'Compensation structuring',
      'Employee engagement strategies'
    ],
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Salary Benchmarking',
    description: 'Our salary benchmarking service provides market-based compensation insights to help businesses remain competitive.',
    features: [
      'Market-based salary analysis',
      'Industry-standard compensation reports',
      'Negotiation support for salary discussions'
    ],
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    title: 'Global Recruitment Services',
    description: 'We specialize in international staffing solutions, connecting businesses with global talent across industries.',
    features: [
      'International staffing solutions',
      'Talent acquisition across global markets',
      'Immigration and visa support'
    ],
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Background Verification',
    description: 'Ensure hiring integrity with our thorough background checks, covering professional, educational, and criminal records.',
    features: [
      'Pre-employment screening',
      'Educational and professional verification',
      'Criminal and credit history checks'
    ],
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Training and Development',
    description: 'Enhance employee skills and leadership capabilities with our customized corporate training programs.',
    features: [
      'Corporate training programs',
      'Leadership development',
      'Upskilling and reskilling initiatives'
    ],
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  }
];

const industries = [
  { name: 'Information Technology', icon: '💻' },
  { name: 'Banking & Finance', icon: '💰' },
  { name: 'Manufacturing', icon: '🏭' },
  { name: 'Healthcare', icon: '🏥' },
  { name: 'Retail', icon: '🛍️' },
  { name: 'Construction', icon: '🏗️' },
  { name: 'Education', icon: '🎓' },
  { name: 'Telecommunications', icon: '📱' }
];

const ServiceCard = ({ service, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative bg-white rounded-xl shadow-xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-8">
        <div className="flex justify-between items-start">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            className="text-indigo-600 mb-4"
          >
            {service.icon()}
          </motion.div>
          
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.7 }}
            className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center"
          >
            <span className="text-indigo-600 font-bold">{index + 1}</span>
          </motion.div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
        <p className="text-gray-600 mb-6">{service.description}</p>
        
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {service.features.map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="flex items-center gap-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 flex-none text-indigo-600" />
              <span className="text-gray-700">{feature}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.1 : 0 }}
      />
    </motion.div>
  );
};

const IndustryBubble = ({ industry, index }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1 
      }}
      whileHover={{ 
        scale: 1.1,
        transition: { duration: 0.2 }
      }}
      className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full p-6 aspect-square shadow-lg"
    >
      <div className="text-3xl mb-2">{industry.icon}</div>
      <div className="text-white font-medium text-center">{industry.name}</div>
    </motion.div>
  );
};

const ParallaxBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="absolute w-full h-full"
        style={{ 
          backgroundImage: 'url("/api/placeholder/1600/900")',
          backgroundSize: 'cover',
          filter: 'blur(8px) brightness(0.4)',
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70" />
      
      {/* Animated shapes */}
      <motion.div 
        className="absolute top-20 left-20 w-32 h-32 rounded-full bg-indigo-500 opacity-20"
        animate={{ 
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8
        }}
      />
      <motion.div 
        className="absolute bottom-40 right-20 w-48 h-48 rounded-full bg-purple-500 opacity-20"
        animate={{ 
          y: [0, -40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 10,
          delay: 1
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-blue-500 opacity-20"
        animate={{ 
          x: [0, 30, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 7,
          delay: 2
        }}
      />
    </div>
  );
};

function Services() {
  const [activeTab, setActiveTab] = useState(0);
  
  // For rotating text animation
  const phrases = ["Talent", "Success", "Growth", "Innovation", "Excellence"];
  const [currentPhrase, setCurrentPhrase] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % phrases.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-black py-32 sm:py-40">
        <ParallaxBackground />
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="inline-block mb-6"
            >
              <span className="inline-flex items-center px-4 py-1 rounded-full bg-indigo-600 bg-opacity-20 text-indigo-300 text-sm font-medium">
                Transforming Recruitment
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-2">
              Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">Services</span>
            </h1>
            
            <div className="h-16 overflow-hidden relative mb-8">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: currentPhrase * -64 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full"
              >
                {phrases.map((phrase, index) => (
                  <h2 key={phrase} className="text-3xl md:text-4xl font-bold h-16 flex items-center justify-center text-indigo-300">
                    Powering Your {phrase}
                  </h2>
                ))}
              </motion.div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto"
            >
              We combine industry expertise with innovative approaches to deliver exceptional recruitment and HR solutions tailored to your unique organizational needs.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-10 flex flex-wrap gap-4 justify-center"
            >
              <Link
                to="/contact"
                className="relative overflow-hidden rounded-full bg-indigo-600 px-6 py-3 text-white shadow-lg hover:bg-indigo-700 transition-colors group"
              >
                <span className="relative z-10">Get Started Now</span>
                <motion.span 
                  className="absolute inset-0 bg-indigo-400 opacity-0 group-hover:opacity-30"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
              
              <Link
                to="/about"
                className="relative overflow-hidden rounded-full bg-transparent border border-indigo-300 px-6 py-3 text-indigo-100 shadow-lg hover:bg-indigo-900 hover:bg-opacity-20 transition-all group"
              >
                <span className="relative z-10">Learn More</span>
                <motion.span 
                  className="absolute inset-0 bg-indigo-300 opacity-0 group-hover:opacity-10"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Animated Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ 
              delay: 1.2,
              y: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white opacity-70">
              <path d="M12 5v14m-7-7l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Services Tabs & Cards */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Comprehensive Solutions
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              From finding the perfect candidate to transforming your HR operations, our expert team delivers tailored services to meet your unique business needs.
            </p>
            
            {/* Service Categories Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-10">
              <button
                onClick={() => setActiveTab(0)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 0
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Services
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 1
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Recruitment
              </button>
              <button
                onClick={() => setActiveTab(2)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 2
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                HR Services
              </button>
              <button
                onClick={() => setActiveTab(3)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 3
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Training
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Industries Section */}
      <div className="bg-gradient-to-b from-indigo-900 to-purple-900 py-24 sm:py-32 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
            }}
          />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Industries We Serve
            </h2>
            <p className="mt-6 text-lg leading-8 text-indigo-100 max-w-3xl mx-auto">
              Our expertise spans across multiple sectors, allowing us to understand and meet the unique requirements of each industry.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <IndustryBubble key={industry.name} industry={industry} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              What Our Clients Say
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Hear from businesses that have transformed their recruitment and HR operations with our services.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg mr-4">
                    {["AB", "CD", "EF"][item - 1]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {["Anna Brown", "Chris Davidson", "Emma Fischer"][item - 1]}
                    </h3>
                    <p className="text-gray-500">
                      {["HR Director, Tech Co", "CEO, Finance Inc", "COO, Healthcare Group"][item - 1]}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  {[
                    "Their recruitment services completely transformed our hiring process. We've reduced time-to-hire by 40% while increasing the quality of candidates.",
                    "The HR consultancy team provided invaluable guidance during our company restructuring. Their expertise was crucial to our success.",
                    "We've been using their training programs for over a year now, and the improvement in our team's performance has been remarkable."
                  ][item - 1]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 px-6 py-24 sm:px-6 sm:py-32 lg:px-8"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your recruitment process?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Let's discuss how our services can help you find and retain the best talent for your organization.
            </p>
            
            <motion.div 
              className="mt-10 flex flex-wrap items-center justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link
                to="/contact"
                className="relative overflow-hidden rounded-full bg-white px-8 py-3 text-indigo-600 font-medium shadow-lg hover:shadow-xl transition-all group"
              >
                <span className="relative z-10">Schedule a Consultation</span>
                <motion.span 
                  className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
              
              <Link
                to="/jobs"
                className="group flex items-center text-lg font-medium text-white"
              >
                <span>View Open Positions</span>
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-y-16 gap-x-8 text-center lg:grid-cols-4"
          >
            {[
              { value: "1000+", label: "Clients Served" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "15K+", label: "Successful Placements" },
              { value: "25+", label: "Years of Experience" }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-4xl font-bold tracking-tight text-indigo-600">{stat.value}</div>
                  <div className="mt-4 text-base leading-7 text-gray-600">{stat.label}</div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Find answers to common questions about our services and processes.
            </p>
          </motion.div>
          
          <div className="mx-auto max-w-3xl space-y-6">
            {[
              {
                question: "How long does the recruitment process typically take?",
                answer: "Our standard recruitment timeline ranges from 2-4 weeks, depending on the position complexity and market conditions. We work to optimize the process while ensuring quality candidates."
              },
              {
                question: "Do you offer services for small businesses?",
                answer: "Absolutely! We have tailored packages designed specifically for small businesses that provide essential recruitment and HR support at accessible price points."
              },
              {
                question: "What industries do you specialize in?",
                answer: "We have deep expertise across multiple sectors including IT, Finance, Healthcare, Manufacturing, and more. Our industry specialists understand the unique talent requirements for each field."
              },
              {
                question: "Can you help with international hiring?",
                answer: "Yes, our Global Recruitment Services team specializes in international talent acquisition. We handle everything from sourcing to immigration support for seamless cross-border hiring."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 bg-white p-6 text-lg font-medium text-gray-900">
                    <h3>{faq.question}</h3>
                    <motion.div
                      animate={{ rotate: 0 }}
                      variants={{
                        open: { rotate: 180 },
                        closed: { rotate: 0 }
                      }}
                      className="h-5 w-5 flex-shrink-0 text-indigo-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </motion.div>
                  </summary>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="bg-white px-6 pb-6 text-gray-600"
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 animate-gradient-x">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate mx-auto max-w-2xl text-center">
            {/* Decorative elements */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute -top-24 -left-12 h-40 w-40 rounded-full bg-indigo-400 opacity-20 blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute -bottom-24 -right-12 h-40 w-40 rounded-full bg-purple-400 opacity-20 blur-2xl"
            />
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Start your journey to better recruitment today
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100"
            >
              Join thousands of companies that have transformed their hiring processes with our expert services.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-6"
            >
              <Link
                to="/contact"
                className="relative overflow-hidden rounded-full bg-white px-8 py-3 text-indigo-600 font-medium shadow-lg hover:shadow-xl transition-all group"
              >
                <span className="relative z-10">Get Started Now</span>
                <motion.span 
                  className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Services);