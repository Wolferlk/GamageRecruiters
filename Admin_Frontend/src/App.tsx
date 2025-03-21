import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientUsers from './pages/ClientUsers';
import AdminUsers from './pages/AdminUsers';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import Workshops from './pages/Workshops';
import Blog from './pages/Blog';
import Partners from './pages/Partners';
import ClientDetailsPage from './pages/Client/ClientView';
import ViewAllJobs from './components/Jobs/ViewAllJobs';
import AddJob from './components/Jobs/AddJob';
import EditJob from './components/Jobs/EditJob';
import CandidateDetailsView from './components/Jobs/CandidateDetailsView';

function App() {
  // TODO: Implement actual auth logic
  const isAuthenticated = true;

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Login />} />
          
          {isAuthenticated ? (
            <Route element={<Layout />}>
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<ClientUsers />} />
              <Route path="/admins" element={<AdminUsers />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobss" element={<ViewAllJobs />} />
              <Route path="/jobss/add" element={<AddJob />} />
              <Route path="/jobss/edit/:jobid" element={<EditJob />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/candidate" element={<CandidateDetailsView />} />
              <Route path="/clients/:clientId" element={<ClientDetailsPage />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;