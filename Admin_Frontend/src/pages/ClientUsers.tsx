import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit2, Trash2, Search, UserPlus, Eye, 
  ChevronUp, ChevronDown, Filter, MoreHorizontal,
  Download, RefreshCw, Share2, Calendar
} from 'lucide-react';
import { mockUsers } from '../data/mockData';

function ClientUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const clients = mockUsers.filter(user => user.role === 'client');

  // Filter clients based on search term and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sort clients by joined date
  const sortedClients = [...filteredClients].sort((a, b) => {
    const dateA = new Date(a.joinedDate).getTime();
    const dateB = new Date(b.joinedDate).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortDirection = () => {
    setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
  };

  // Get relative time string (e.g., "2 days ago")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays/30)} months ago`;
    return `${Math.floor(diffInDays/365)} years ago`;
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Client Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and view all client accounts</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Client
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Clients</h3>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{clients.length}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-500 flex items-center">
              <ChevronUp className="h-4 w-4" />
              12%
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-2">from last month</span>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Clients</h3>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <UserPlus className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {clients.filter(c => c.status === 'active').length}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-500 flex items-center">
              <ChevronUp className="h-4 w-4" />
              8%
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-2">from last month</span>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">New This Month</h3>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">12</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-red-500 flex items-center">
              <ChevronDown className="h-4 w-4" />
              3%
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-2">from last month</span>
          </div>
        </motion.div>
      </div>

      {/* Client Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)} 
                  className={`flex items-center px-3 py-2 border ${isFilterOpen ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  {filterStatus !== 'all' && (
                    <span className="ml-2 w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"></span>
                  )}
                </button>
                
                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                    <button 
                      onClick={() => { setFilterStatus('all'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${filterStatus === 'all' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      All Clients
                    </button>
                    <button 
                      onClick={() => { setFilterStatus('active'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${filterStatus === 'active' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      Active Only
                    </button>
                    <button 
                      onClick={() => { setFilterStatus('inactive'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${filterStatus === 'inactive' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      Inactive Only
                    </button>
                  </div>
                )}
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    onClick={toggleSortDirection}
                    className="flex items-center focus:outline-none group"
                  >
                    Joined
                    <span className="ml-1 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                      {sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
              {sortedClients.map((client) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={client.avatarUrl}
                        className="h-10 w-10 rounded-full"
                        alt={`${client.name}'s avatar`}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {client.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        client.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getRelativeTime(client.joinedDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-3">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Eye className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Edit2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <MoreHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            
            {/* Empty State */}
            {sortedClients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-24 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <Search className="h-8 w-8 mx-auto mb-4" />
                    <p className="font-medium">No clients found</p>
                    <p className="mt-1 text-sm">Try adjusting your search or filters</p>
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

export default ClientUsers;