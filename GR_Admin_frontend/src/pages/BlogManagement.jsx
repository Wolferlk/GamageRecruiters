import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit2, Trash2, Search, PlusCircle,
  ChevronUp, ChevronDown, 
  Download, RefreshCw, Share2, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../config/baseUrlConfig';

function BlogManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/blogs`);
      setBlogPosts(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = blogPosts.filter(post => {
    return post?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post?.author?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a?.addedAt || 0).getTime();
    const dateB = new Date(b?.addedAt || 0).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('No blogId provided for delete!');
      alert('Error: Blog ID is missing');
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${baseURL}/api/blogs/delete/${id}`, {
        withCredentials: true
      });
      if (response.status === 200) {
        setBlogPosts(prev => prev.filter(post => post.blogId !== id));
        alert("Blog deleted successfully");
      } else {
        alert("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Something went wrong while deleting.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and publish blog posts</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchPosts} 
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            onClick={() => navigate("/blog/add")}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Post
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Posts Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Posts</h3>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {blogPosts.length.toLocaleString()}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-500 flex items-center">
              <ChevronUp className="h-4 w-4" />
              15%
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-2">from last month</span>
          </div>
        </motion.div>
        
        {/* Total Engagement Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Engagement</h3>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
              <Share2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {(
              blogPosts.reduce((sum, post) => sum + (
                (post?.likes || 0) + 
                (post?.comments || 0) + 
                (post?.views || 0)
              ), 0)
            ).toLocaleString()}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-500 flex items-center">
              <ChevronUp className="h-4 w-4" />
              23%
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-2">from last month</span>
          </div>
        </motion.div>
      </div>

      {/* Blog Posts Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Search Bar */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              />
            </div>
            
            <button 
              onClick={toggleSortDirection} 
              className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {sortDirection === 'asc' ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Oldest First
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Newest First
                </>
              )}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    onClick={toggleSortDirection}
                    className="flex items-center focus:outline-none group"
                  >
                    Date
                    <span className="ml-1 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                      {sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
              {sortedPosts.map((post) => (
                <motion.tr
                  key={post.blogId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={`${baseURL}/uploads/blogs/images/${post.blogImage}`}
                        className="h-14 w-20 rounded-lg object-cover"
                        alt={`${post.title} thumbnail`}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <span className="flex items-center">
                            <img 
                              src={`${baseURL}/uploads/blogs/authors/${post.authorImage}`} 
                              alt={post.author.name}
                              className="h-5 w-5 rounded-full mr-1"
                            />
                            {post.author.name}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white mb-2">
                      {post.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {post.date}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {getRelativeTime(post.addedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                      <span className="flex items-center">
                        {(post?.views || 0).toLocaleString()} views
                      </span>
                      <span className="flex items-center">
                        {(post?.likes || 0).toLocaleString()} likes
                      </span>
                      <span className="flex items-center">
                        {(post?.comment || 0).toLocaleString()} comments
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-3">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                       onClick={() => navigate(`/blog/edit/${post.blogId}`)}
                        >
                        <Edit2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.blogId)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                        <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              </AnimatePresence>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin" />
                      <p className="font-medium">Loading posts...</p>
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && sortedPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <Search className="h-8 w-8 mx-auto mb-4" />
                      <p className="font-medium">No blog posts found</p>
                      <p className="mt-1 text-sm">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default BlogManagement;