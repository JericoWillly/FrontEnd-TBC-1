import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Compass, User, Settings, LogOut, Menu, X, Shield, Search } from 'lucide-react';

function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-200 font-medium border-b-2 border-blue-200' : 'hover:text-blue-200';
  };

  return (
    <nav className={`${scrolled ? 'bg-blue-700 shadow-lg' : 'bg-blue-600'} text-white fixed w-full top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
              T
            </div>
            <span className="text-xl font-bold hidden sm:block">TBC-A</span>
          </Link>

          {/* Desktop Navigation */}
          {currentUser ? (
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className={`px-3 py-2 rounded-md ${isActive('/')}`}>
                <div className="flex items-center space-x-1">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </div>
              </Link>
              <Link to="/explore" className={`px-3 py-2 rounded-md ${isActive('/explore')}`}>
                <div className="flex items-center space-x-1">
                  <Compass className="w-4 h-4" />
                  <span>Explore</span>
                </div>
              </Link>
              <Link to="/profile" className={`px-3 py-2 rounded-md ${isActive('/profile')}`}>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </div>
              </Link>
              {isAdmin && (
                <Link to="/admin" className={`px-3 py-2 rounded-md ${isActive('/admin')}`}>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </div>
                </Link>
              )}
              
              <div className="ml-4 pl-4 border-l border-blue-500 flex items-center">
                <div className="group relative">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <img
                      src={
                        currentUser.profilePicture
                          ? `https://image-hosting.kuncipintu.my.id${currentUser.profilePicture}`
                          : '/default-profile.png'
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white/30 hover:border-white transition-all"
                    />
                    <span className="max-w-28 truncate">{currentUser.name || currentUser.email}</span>
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="px-4 py-2 font-medium rounded hover:bg-blue-700 transition-colors">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-white text-blue-600 font-medium rounded hover:bg-blue-50 transition-colors">Register</Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && currentUser && (
        <div className="md:hidden bg-blue-700 shadow-inner pb-4 px-4 space-y-1 transition-all duration-300">
          <div className="pt-4 pb-3 border-t border-blue-500">
            <div className="flex items-center px-4 mb-3">
              <div className="flex-shrink-0">
                <img
                  src={
                    currentUser.profilePicture
                      ? `https://image-hosting.kuncipintu.my.id${currentUser.profilePicture}`
                      : '/default-profile.png'
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">{currentUser.name || currentUser.email}</div>
                <div className="text-sm text-blue-200">{currentUser.email}</div>
              </div>
            </div>
            <div className="space-y-1">
              <Link to="/" className="block px-3 py-2 rounded-md hover:bg-blue-800 flex items-center space-x-3">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link to="/explore" className="block px-3 py-2 rounded-md hover:bg-blue-800 flex items-center space-x-3">
                <Compass className="w-5 h-5" />
                <span>Explore</span>
              </Link>
              <Link to="/profile" className="block px-3 py-2 rounded-md hover:bg-blue-800 flex items-center space-x-3">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="block px-3 py-2 rounded-md hover:bg-blue-800 flex items-center space-x-3">
                  <Shield className="w-5 h-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <Link to="/settings" className="block px-3 py-2 rounded-md hover:bg-blue-800 flex items-center space-x-3">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-red-600 text-white flex items-center space-x-3"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu for non-logged in users */}
      {isMenuOpen && !currentUser && (
        <div className="md:hidden bg-blue-700 pb-4 px-4 space-y-3">
          <div className="pt-4 flex flex-col space-y-2">
            <Link 
              to="/login" 
              className="px-4 py-2 text-center rounded bg-blue-800 hover:bg-blue-900 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 text-center bg-white text-blue-600 font-medium rounded hover:bg-blue-50 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
