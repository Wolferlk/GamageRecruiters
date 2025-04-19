import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './Pages/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import JobListings from './Pages/JobListings';
import JobDetails from './Pages/JobDetails';
import Contact from './Pages/Contact';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Application from './Pages/Application';
import BlogPage from './Pages/BlogPage';
import BlogDetailsPage from './Pages/BlogDetailsPage';
import TrustedPartners from './Pages/TrustedPartners';
import WorkshopsAndSeminarsPage from './Pages/WorkshopsAndSeminarsPage';
import VerifyEmail from './Pages/VerifyEmail';
import EmailCheck from './Pages/EmailCheck';
import ResetPassword from './Pages/ResetPassword';
import TestimonialsSection from './Pages/TestimonialsSection';
import WindowOnClose from './protected/WindowOnClose';
import ProtectedRoute from './protected/ProtectedRoute';

function App() {
  return (
    <Router>
      <WindowOnClose/>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-center" />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/jobs/:jobId" element={<JobDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path='/verifyEmail' element={<VerifyEmail/>} />
            <Route path='/emailCheck' element={<EmailCheck/>} />
            <Route path='/resetPassword' element={<ResetPassword/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/application/:jobApplicationId" element={<ProtectedRoute><Application /></ProtectedRoute>} />
            <Route path="/trusted-partners" element={<TrustedPartners />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:blogId" element={<ProtectedRoute><BlogDetailsPage /></ProtectedRoute>} />
            <Route path="/workshop" element={<ProtectedRoute><WorkshopsAndSeminarsPage /></ProtectedRoute>} />
            <Route path="/testimonials" element={<TestimonialsSection />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;