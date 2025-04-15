import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            Image Hosting
          </Link>

          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Link to="/" className="hover:text-blue-200">Home</Link>
              <Link to="/profile" className="hover:text-blue-200">Profile</Link>
              {isAdmin && (
                <Link to="/admin" className="hover:text-blue-200">Admin Panel</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src={
                    currentUser.profilePicture
                      ? `https://image-hosting.kuncipintu.my.id${currentUser.profilePicture}`
                      : '/default-profile.png'
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <span>{currentUser.name || currentUser.email}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="hover:text-blue-200">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
