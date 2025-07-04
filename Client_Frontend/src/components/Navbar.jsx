import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Workshops & Seminars', href: '/workshop' },
  { name: 'Blog', href: '/blog' },
  { name: 'Trusted Partners', href: '/trusted-partners' },
  { name: 'Contact', href: '/contact' },
];

// Secondary navigation for user-specific actions
const userNavigation = [
  { name: 'Login', href: '/login', icon: '→' },
  { name: 'Sign Up', href: '/signup', icon: '✦' },
  { name: 'Dashboard', href: '/dashboard', icon: '☰' },
];

export default function Navbar({ fixedColor }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const location = useLocation();
  // Detect scroll position for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Set active link based on current path
    setActiveLink(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    let scrollY = 0;
    const isDashboardPage = location.pathname === '/dashboard';

    if (mobileMenuOpen) {
      if (isDashboardPage) { // <--- Start of new conditional logic
        document.body.style.overflow = 'hidden';
      } else {
        scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.width = '100%';
      } // <--- End of new conditional logic
    } else {
      // Only restore scroll if we are on the same page AND NOT on the dashboard
      if (!isDashboardPage) { // <--- Add this condition
        const scrollYValue = document.body.style.top;
        if (scrollYValue) {
          const restoreScrollY = parseInt(scrollYValue || '0') * -1;
          window.scrollTo(0, restoreScrollY);
        }
      }

      // Clear lock styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
    }
  }, [mobileMenuOpen, location.pathname]);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-40 transition-all duration-300 ${
        fixedColor
          ? 'bg-black/50 backdrop-blur-lg shadow-lg'
          : (scrolled ? 'bg-black/50 backdrop-blur-lg shadow-lg' : 'bg-transparent')
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8" aria-label="Global">
        {/* Logo */}
        <Link to="/" className="-m-1.5 p-1.5">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.img 
              src="https://i.ibb.co/twq26b0M/W-logo-Untitled-1.png" 
              alt="Gamage Recruiters Logo" 
              className="h-10 w-auto mr-3"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="text-2xl font-bold text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400"></span>GAMAGE RECRUITERS
              </span>
            </motion.div>
          </motion.div>
        </Link>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <motion.button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
            whileTap={{ scale: 0.9 }}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>

        {/* Desktop menu - with dropdown capability */}
        <div className="hidden lg:flex lg:gap-x-8 ml-8">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="group relative"
            >
              <Link to={item.href} onClick={() => setActiveLink(item.href)}>
                <div className="relative py-2">
                  <span 
                    className={`text-sm font-semibold leading-6 ${
                      activeLink === item.href ? 'text-purple-400' : 'text-white'
                    } hover:text-purple-400 transition-colors duration-300`}
                  >
                    {item.name}
                  </span>
                  {activeLink === item.href ? (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full"
                      layoutId="underline"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  ) : (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500/0 rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%', backgroundColor: 'rgba(168, 85, 247, 0.3)' }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* User actions dropdown */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-x-4">
          <div className="relative">
            <motion.button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Account 
              <motion.svg
                className="ml-2 h-4 w-4"
                animate={{ rotate: userMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </motion.svg>
            </motion.button>
            
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute right-0 mt-2 w-48 bg-black/50 backdrop-blur-xl rounded-lg shadow-lg shadow-purple-500/10 border border-purple-600/20 overflow-hidden z-50"
                >
                  <div className="py-2">
                    {userNavigation.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.2 }}
                      >
                        <Link
                          to={item.href}
                          className="px-4 py-2 text-sm text-white hover:bg-purple-800/30 transition-colors duration-300 flex items-center justify-between"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {item.name}
                          <span className="text-purple-400">{item.icon}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Mobile menu - enhanced design */}
      <AnimatePresence>
  {mobileMenuOpen && (
    <motion.div
      className="fixed top-0 left-0 right-0 bottom-0 z-[100] h-screen w-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sliding panel */}
      <motion.div
        className="absolute right-0 top-0 h-full w-full sm:max-w-sm bg-black/80 backdrop-blur-xl overflow-y-auto z-[110] px-6 py-6"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center">
            <img src="https://i.ibb.co/twq26b0M/W-logo-Untitled-1.png" alt="Gamage Recruiters Logo" className="h-8 w-auto mr-2" />
            <span className="text-2xl font-bold text-white">
              <span className="text-purple-500">G</span><span className="text-purple-400">R</span>
            </span>
          </Link>
          <motion.button
            type="button"
            className="-m-2.5 rounded-full p-2.5 text-white hover:bg-purple-900/50 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(false)}
            whileTap={{ scale: 0.9 }}
          >
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        <div className="mt-10 flow-root">
          <div className="-my-6 divide-y divide-gray-700/30">
            <div className="space-y-1 py-6">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={item.href}
                    className={`-mx-3 block rounded-lg px-4 py-3 text-base font-semibold leading-7 ${
                      activeLink === item.href ? 'text-purple-400 bg-purple-900/30' : 'text-white'
                    } hover:bg-purple-900/20 transition-all duration-300`}
                    onClick={() => {
                      setActiveLink(item.href);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                    {activeLink === item.href && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-2 text-purple-400"
                      >
                        •
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="py-6 space-y-3">
              {userNavigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                >
                  <Link
                    to={item.href}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-purple-900/20 text-base font-semibold text-white hover:bg-purple-900/30 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                    <span className="ml-2 text-purple-400">{item.icon}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </motion.header>
  );
}