import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Quote, Star } from 'lucide-react';

const TestimonialsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const testimonialsPerPage = 3;
  const navigate = useNavigate();

  const testimonials = [
    {
        name: "Damayantha Surampika",
        role: "Senior Marketing Executive",
        company: "Gamage Recruiters",
        quote: "I am beyond grateful to Gamage Recruiters for connecting me with the perfect career opportunity. Their guidance and support helped me secure a role as a Senior Marketing Executive at a reputed firm, where I can truly showcase my skills. The recruitment team understood my strengths and aspirations, making the entire process smooth and stress-free. Thank you for paving the way for my professional growth!",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Sapthika Sandaruwani",
        role: "HR Coordinator",
        company: "Gamage Recruiters",
        quote: "Finding a job that aligns with my passion was made possible by Gamage Recruiters. They not only provided me with an opportunity but also mentored me throughout the selection process. Today, I am excelling as an HR Coordinator, thanks to their continuous support and encouragement. I truly appreciate their efforts in shaping my career!",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Rasika",
        role: "Software Engineer",
        company: "Gamage Recruiters",
        quote: "I had been searching for the right job for months, but it was Gamage Recruiters that finally helped me land my dream job as a Software Engineer. Their dedication and professionalism ensured I was matched with a company that values my expertise. I highly recommend them to anyone seeking a fulfilling career path. Thank you for making this journey so rewarding!",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Nehara Sampath",
        role: "Business Analyst",
        company: "Gamage Recruiters",
        quote: "Gamage Recruiters played a crucial role in my career transition by helping me secure a position as a Business Analyst. Their recruitment process was seamless, and they took the time to understand my career goals. I am now working at a company that challenges and excites me every day. Thank you for making this possible!",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Isuru Dananjaya",
        role: "Operations Manager",
        company: "Gamage Recruiters",
        quote: "I sincerely appreciate Gamage Recruiters for helping me take a major step forward in my career. With their assistance, I secured an Operations Manager role at a leading company, and I couldn’t be happier with the growth opportunities. Their professionalism and commitment to job seekers are truly commendable. Thank you for making a difference in my career!",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Nimsara Hettiarachchi",
        role: "Digital Marketing Specialist",
        company: "Gamage Recruiters",
        quote: "Thanks to Gamage Recruiters, I found a position that perfectly matches my skills and ambitions. Today, I am thriving as a Digital Marketing Specialist, working on projects I love and growing professionally every day. Their team was supportive, transparent, and always available to guide me. I couldn’t have done it without them!",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Saman Kumara",
        role: "Logistics Supervisor",
        company: "Gamage Recruiters",
        quote: "Gamage Recruiters helped me secure a stable and rewarding position as a Logistics Supervisor. Their support, from resume building to interview preparation, made all the difference in my job search. I am now part of a great team, and I owe my success to their exceptional recruitment services. Thank you for your unwavering support!",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "H.P.Malith Kalinga",
        role: "Team Lead Intern",
        company: "Gamage Recruiters",
        quote: "My six-month internship as a Software Team Lead Intern at Gamage Recruiters was truly an unforgettable experience. I had the privilege of working with an incredible team, tackling real-world challenges, and growing both technically and personally. Every project we built, every problem we solved together, and every late-night debugging session shaped me into a more confident and skilled developer. The support and collaboration made it feel like more than just an internship—it felt like family. Grateful for every moment!",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Sonali Nipunika",
        role: "HR Coordinator ",
        company: "Gamage Recruiters",
        quote: "My full time opportunity at Gamage Recruiters was a turning point in my career. I gained hands-on experience in recruitment, employee engagement, and HR operations, which helped me secure a full-time Senior HR Executive. The mentorship and real-world exposure I received were invaluable. I am truly grateful for the opportunity!",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Kasun Jayasekara",
        role: "SE Intern",
        company: "Gamage Recruiters",
        quote: "Gamage Recruiters provided me with an incredible platform to enhance my technical and problem-solving skills. During my time here, I worked on real-world projects that strengthened my knowledge of the MERN stack. Today, I am a Full-Stack Developer and I owe a huge part of my success to the amazing learning experience I had at Gamage Recruiters!",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Nadeesha Wijesinghe",
        role: "BA Intern",
        company: "Gamage Recruiters",
        quote: "I started as a Business Analyst Intern at Gamage Recruiters, where I learned data analytics, market research, and business optimization strategies. The practical experience and guidance I received helped me land a role as a Data Analyst",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "P.Jenojan",
        role: "SE Intern",
        company: "Gamage Recruiters",
        quote: "Gamage Recruiters gave me the perfect platform to develop my skills and gain industry exposure.",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Sadun Madusanka",
        role: "Social Media Marketing Intern",
        company: "Gamage Recruiters",
        quote: "Gamage Recruiters gave me the confidence to pursue a career in digital marketing. From managing LinkedIn and YouTube to developing content strategies, I gained valuable skills that helped me secure a full-time role as a Social Media Strategist.",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Rashmika Fernando",
        role: "UI/UX Intern",
        company: "Gamage Recruiters",
        quote: "Working as a Creative Designer for one year at Gamage Recruiters was an enriching experience. I had the opportunity to work on website and mobile UI/UX projects, which strengthened my design skills.",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Nashreen Kadeeja Liyanage",
        role: "HR Intern",
        company: "Gamage Recruiters",
        quote: "The first ever corporate experience was at Gamage Recruiters. For a period of 6 months, I received hands on quality experience regarding all HR operations and management. This gave me a head start and I'm currently pursuing a very valuable position because of them. If they hadn't given me a chance I don't know who would have! Forever grateful for all the support my team and I had. I wish nothing but success to the organization. Thank you once again❤️",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    },
    {
        name: "Ravindu Yasith",
        role: "Creative Designer Intern",
        company: "Gamage Recruiters",
        quote: "My internship at Gamage Recruiters was an incredible learning experience that helped me develop both my creative and leadership skills. As a Team Lead in the Creative Design team, I had the opportunity to oversee projects, manage tasks, and collaborate with a talented group of individuals. This experience sharpened my ability to think strategically, communicate effectively, and deliver compelling visual content. The fast-paced and dynamic environment at Gamage Recruiters prepared me for future roles and gave me the confidence to take on bigger responsibilities in my career. I’m grateful for the mentorship and hands-on experience I gained during my time there!",
        image: "https://i.ibb.co/PvCfxjd9/gamage.png"
    }
];

  const toggleReadMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const goBack = () => {
    // This function would be connected to your app's navigation system
    console.log("Going back to previous page");
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-12">
        <button
            onClick={() => navigate('/')}
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-300 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
        
        {/* Header with decorative elements */}
        <div className="text-center mb-16 relative">
          
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Success Stories
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-24 bg-indigo-400 rounded-full"></div>
          </div>
          <p className="mt-6 text-xl leading-8 text-gray-300 max-w-2xl mx-auto">
            Discover how professionals transformed their careers through Gamage Recruiters
          </p>
        </div>

        {/* Testimonial Cards with Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group border-t-4 border-indigo-500"
            >
              {/* Decorative quote icon */}
              <div className="absolute -top-4 -right-4 text-gray-700 opacity-30 transition-opacity duration-500 group-hover:opacity-60">
                <Quote className="w-24 h-24" fill="currentColor" />
              </div>
              
              {/* Content */}
              <div className="flex flex-col h-full">
                <div className="flex items-start mb-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1 rounded-full">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-indigo-400 font-medium">{testimonial.role}</p>
                    <p className="text-gray-400 text-sm">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex-grow">
                  {expandedIndex !== index ? (
                    <p className="text-gray-300 italic line-clamp-4">"{testimonial.quote}"</p>
                  ) : (
                    <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                  )}
                </div>
                
                <button 
                  className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium flex items-center self-start transition-colors duration-300" 
                  onClick={() => toggleReadMore(index)}
                >
                  {expandedIndex !== index ? "Read full story" : "Show less"}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional design element */}
        <div className="mt-16 flex justify-center">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 flex items-center shadow-lg hover:shadow-xl">
            Share Your Success Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(TestimonialsSection);