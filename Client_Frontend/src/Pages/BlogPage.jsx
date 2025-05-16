import { Link } from 'react-router-dom';
import { memo, useCallback, useEffect, useState } from 'react';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useChangeDateFormat } from '../hooks/customHooks';
import { verifyEmail } from '../scripts/verifyData';
import baseURL from '../config/axiosPortConfig';

// const blogPosts = [
//   {
//     id: 1,
//     title: "Future of Remote Work in Sri Lanka",
//     excerpt: "Exploring how Sri Lankan companies are adapting to hybrid work models and global employment trends...",
//     category: "Industry Trends",
//     date: "March 15, 2024",
//     readTime: "5 min read",
//     image: "https://www.activtrak.com/wp-content/uploads/2023/09/blog-header-7-steps-productive-remote-work-environment.jpg"
//   },
//   {
//     id: 2,
//     title: "Top 5 Tech Skills in Demand for 2024",
//     excerpt: "Discover the most sought-after technical skills in the Sri Lankan job market this year...",
//     category: "Career Advice",
//     date: "March 12, 2024",
//     readTime: "4 min read",
//     image: "https://lmic-cimt.ca/wp-content/uploads/2024/02/LMIC-Blog-RemoteWork-HeaderImg.jpg"
//   },
//   {
//     id: 3,
//     title: "Building Effective Workplace Cultures",
//     excerpt: "Strategies for creating productive and positive work environments in modern organizations...",
//     category: "HR Insights",
//     date: "March 10, 2024",
//     readTime: "6 min read",
//     image: "https://www.zdnet.com/a/img/resize/05a31ea7c81fe137fd6e986943774def719abd95/2022/05/31/3caae7fa-5d4a-46ae-b483-a60b03540913/remote-working-from-home-man-professional-zoom-teams-video-call.jpg?auto=webp&width=1280"
//   },
// ];

const categories = ['All', 'Industry Trends', 'Career Advice', 'HR Insights', 'Market News'];

function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchBlogPages();
  }, [])

  const fetchBlogPages = useCallback(async () => {
    try {
      const fetchBlogsResponse = await axios.get(`${baseURL}/api/blogs`);
      console.log(fetchBlogsResponse.data);
      if(fetchBlogsResponse.status == 200) {
        setBlogPosts(fetchBlogsResponse.data.data);
      } else if (fetchBlogsResponse.status == 404) {
        console.log('No Blog Data Found');
        setBlogPosts([]);
        return;
      } else {
        console.log('Error occured while fetching blog data');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }, [blogPosts]); 

  const handleSubscribe = async () => {
    if(!email) {
      toast.error('Please enter your email');
      return;
    }

    if(!verifyEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const subscribeToNewsLetterResponse = await axios.post(`${baseURL}/user/subscribe-newsletter`, { email: email });
      console.log(subscribeToNewsLetterResponse.data);
      if(subscribeToNewsLetterResponse.status == 200) {
        toast.success('Subscribed to NewsLetter Successfully');
        setEmail('');
        return;
      } else {
        toast.error('An error occured. Please try again');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-black to-gray-900 text-white">
        <ToastContainer/>
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <span className="uppercase text-sm font-semibold text-gray-400">Featured Article</span>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              Navigating Sri Lanka's Evolving Job Market
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Comprehensive analysis of current employment trends and strategic career planning
            </p>
            <div className="mt-8 flex items-center space-x-4 text-sm">
              <span className="bg-white text-black px-3 py-1 rounded-full">Market Report</span>
              <span>March 18, 2024</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-gray-200 pb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        { blogPosts.length !== 0 ? blogPosts.map(blog => (
            <article 
              key={blog.blogId}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-t-xl">
                <img 
                  src={blog.blogImage ? `http://localhost:8000/uploads/blogs/images/${blog.blogImage}` : 'https://via.placeholder.com/400'} 
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">{useChangeDateFormat(blog.addedAt)}</span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    {blog.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  <Link to={`/blog/${blog.blogId}`} className="hover:text-gray-600 transition-colors">
                    {blog.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{blog.readTime}</span>
                  <span className="mx-2">•</span>
                  <Link to={`/blog/${blog.blogId}`} className="font-medium hover:text-gray-900">
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          )) : (
            <p className='text-center'>No Blogs Found!</p>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="mt-24 bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Informed</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Subscribe to our weekly newsletter for the latest career insights and market updates
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              value={email}
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors" onClick={handleSubscribe}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      
    </div>
  );
}

export default memo(BlogPage);