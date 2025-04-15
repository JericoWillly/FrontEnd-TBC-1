import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { photoService } from '../services/api';

function ImageGrid({ photos, onDeletePhoto }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
          <div className="relative">
            <img 
              src={`https://image-hosting.kuncipintu.my.id${photo.url}`} 
              alt={photo.title || 'Photo'} 
              className="w-full h-48 object-cover"
            />
            {onDeletePhoto && (
              <button 
                onClick={() => onDeletePhoto(photo.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                title="Delete photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-gray-800 truncate">{photo.title || 'Untitled'}</h3>
            {photo.description && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{photo.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Home() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoError, setPhotoError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setPhotoError('');
      try {
        const response = await photoService.getMyPhotos();
        if (response && response.data) {
          setPhotos(response.data);
        } else {
          setPhotoError('Invalid response from server when loading photos.');
        }
      } catch (err) {
        console.error('Error fetching photos:', err);
        setPhotoError('Failed to load photos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPhotos();
    }
  }, [isAuthenticated]);

  const handleDeletePhoto = async (photoId) => {
    if (!photoId) return;
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await photoService.deletePhoto(photoId);
        setPhotos(photos.filter(photo => photo.id !== photoId));
      } catch (err) {
        console.error('Failed to delete photo:', err);
        alert('Failed to delete photo. Please try again.');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to view photos.</p>
        <a 
          href="/login" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition-colors"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Photo Gallery</h1>

      {photoError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {photoError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : photos.length > 0 ? (
        <ImageGrid 
          photos={photos} 
          onDeletePhoto={handleDeletePhoto} 
        />
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No photos found.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
