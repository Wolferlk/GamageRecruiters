import React, { useState, useEffect, useRef, memo } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import PartnersGrid from '../components/Patners/PartnersGrid';
import TPSection from '../components/Patners/TpSection';

const TrustedPartnersPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const partnersScrollRef = useRef(null);



  // Testimonials data
  const testimonials = [
    {
      id: 1,
      company: "CBL Group",
      logo: "https://d1l8km4g5s76x5.cloudfront.net/Production/exb_doc/2015/16038/thumb_2015_16038_15864_4687.png",
      quote: "I've had the privilege of working with Gamage Recruiters, and I must commend their exceptional professionalism and collaborative work partnership throughout the talent acquisition process. Their unique and disciplined approach ensures they find the best fit for the role. Having worked with them for a considerable time, I wholeheartedly recommend Gamage Recruiters for executive hires without hesitation.",
      author: "Chamila Senarathne",
      position: "General Manager HR - CBL Food Cluster",
      rating: 5
    },
    {
      id: 2,
      company: "GENXT",
      logo: "https://i.ibb.co/pvn864CX/image.png",
      quote: "Your recruitment service was instrumental in fulfilling our urgent and critical hiring needs. It allowed us to discreetly recruit for senior positions without alerting the market, ensuring confidentiality throughout the process. Additionally, your ability to source qualified candidates with specialized expertise in our specific industry was invaluable. This tailored approach not only saved us time but also ensured that we secured the right talent for key roles.",
      author: "Amali Rathnapala",
      position: "Manager HR-Gnext",
      rating: 5
    },
    {
      id: 3,
      company: "Transocean DUTY FREE (PVT) LTD",
      logo: "https://i.ibb.co/mFHfsjFg/Trans-Ocean.png",
      quote: "Working with Gamage Recruiters has been an outstanding experience. Their team demonstrated exceptional professionalism, efficiency, and dedication in understanding our recruitment needs and delivering top-tier candidates. Their seamless process and industry expertise ensured that we onboarded highly skilled professionals who have contributed significantly to our company’s success. I highly recommend Gamage Recruiters to any organization seeking a reliable and results-driven recruitment partner.",
      author: "R.Jayasinghe",
      position: "Director - Transocean DUTY FREE (PVT) LTD",
      rating: 5
    },
    {
      id: 4,
      company: "MeedRO",
      logo: "https://upload.wikimedia.org/wikipedia/en/0/0a/Union_Assurance_logo.png",
      quote: "Gamage Recruiters exceeded our expectations in every way. Their deep understanding of the maritime industry and commitment to finding the right talent made our hiring process smooth and efficient. They provided us with highly qualified professionals who perfectly matched our requirements. Their proactive approach, attention to detail, and excellent communication made the entire process effortless. We truly appreciate their support and look forward to working with them again in the future.",
      author: "P. Senanayaka",
      position: "Chairman & Director - MeedRo",
      rating: 5
    },
    {
      id: 4,
      company: "Gnanam Food (PVT)Ltd",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCgHY4mRTDRj0DEKOsx98NfZdLfhD_knYSyw&s",
      quote: "Working with Gamage Recruiters was a game-changer! They didn’t just send resumes — they delivered top-tier talent with precision and speed. Sharp, professional, and truly in sync with our hiring goals. Highly recommended!",
      author: "Patchamuthu Satheesan",
      position: "Manager Operations-Gnanam Food ",
      rating: 5
    }
  ];

  // Auto-scrolling effect for partners
  useEffect(() => {
    const scrollRef = partnersScrollRef.current;
    if (!scrollRef) return;

    let scrollPosition = 0;
    const maxScroll = scrollRef.scrollWidth - scrollRef.clientWidth;
    let direction = 1; // 1 for right, -1 for left
    let animationId;

    const animate = () => {
      scrollPosition += direction * 0.5;

      // Change direction when reaching either end
      if (scrollPosition >= maxScroll) {
        direction = -1;
      } else if (scrollPosition <= 0) {
        direction = 1;
      }

      scrollRef.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Auto-changing testimonials randomly
  useEffect(() => {
    // Only set up auto-change if there's more than one testimonial
    if (testimonials.length <= 1) return;

    const changeInterval = setInterval(() => {
      // Generate a random index different from the current one
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * testimonials.length);
      } while (randomIndex === activeTestimonial && testimonials.length > 1);

      setActiveTestimonial(randomIndex);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(changeInterval);
  }, [activeTestimonial, testimonials.length]);

  const navigateTestimonial = (direction) => {
    setActiveTestimonial((prev) =>
      direction === 'next' ? (prev + 1) % testimonials.length : (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      {/* Auto-scrolling Partners Section with updated background gradient (dark to light) */}
      <div className="relative py-10 overflow-hidden mb-auto bg-gradient-to-b from-black to-blue-100">


      </div>
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-6">
            Our Trusted Partners
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-indigo-600 to-blue-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're proud to collaborate with industry leaders across Sri Lanka to deliver exceptional talent solutions and drive business success.
          </p>
        </div>

        <PartnersGrid />
        <TPSection />
        



      </div>





      {/* Testimonials Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-900 to-blue-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-purple-50 to-transparent"></div>
        <div className="absolute -top-12 right-12 w-64 h-64 rounded-full bg-indigo-600 opacity-10"></div>
        <div className="absolute top-1/4 -left-12 w-48 h-48 rounded-full bg-blue-600 opacity-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-indigo-800 opacity-10"></div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              What Our Partners Say
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-indigo-300 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Hear directly from the industry leaders who trust us with their talent acquisition needs.
            </p>
          </div>

          <div className="relative mt-20">
            {/* Large quote icon */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-indigo-300 opacity-20">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
              </svg>
            </div>

            {/* Testimonial Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-bl-full opacity-50"></div>

              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-white p-2 shadow-md mr-4 flex items-center justify-center">
                    <img
                      src={testimonials[activeTestimonial].logo}
                      alt={testimonials[activeTestimonial].company}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{testimonials[activeTestimonial].company}</h3>
                    <div className="flex mt-1">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigateTestimonial('prev')}
                      className="w-10 h-10 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft size={20} className="text-indigo-600" />
                    </button>
                    <button
                      onClick={() => navigateTestimonial('next')}
                      className="w-10 h-10 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-colors"
                    >
                      <ChevronRight size={20} className="text-indigo-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-gray-700 text-lg leading-relaxed italic">"{testimonials[activeTestimonial].quote}"</p>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="font-semibold text-gray-900">{testimonials[activeTestimonial].author}</p>
                  <p className="text-indigo-600">{testimonials[activeTestimonial].position}</p>
                </div>
                <div className="md:hidden flex gap-2">
                  <button
                    onClick={() => navigateTestimonial('prev')}
                    className="w-10 h-10 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft size={20} className="text-indigo-600" />
                  </button>
                  <button
                    onClick={() => navigateTestimonial('next')}
                    className="w-10 h-10 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight size={20} className="text-indigo-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 mx-1 rounded-full transition-colors ${index === activeTestimonial ? 'bg-white' : 'bg-blue-200 bg-opacity-50 hover:bg-blue-100'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    
    </div>
    
  );
};

export default memo(TrustedPartnersPage);