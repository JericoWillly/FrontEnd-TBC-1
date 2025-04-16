import { useState, useEffect } from 'react';
import { photoService } from '../services/api';

function ImageGrid({ photos, onDelete, showUserName = true }) {
  // Tambahkan logging untuk melihat data foto yang diterima
  console.log("Photos received in ImageGrid:", photos);
  
  // Periksa apakah array photos kosong
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No photos available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => {
        // Log setiap foto untuk debugging
        console.log("Processing photo:", photo);
        
        // Perbaikan URL gambar - cek apakah photo.url sudah berisi base URL atau tidak
        const imageUrl = photo.url.startsWith('http') 
          ? photo.url 
          : `https://image-hosting.kuncipintu.my.id/${photo.url.startsWith('/') ? photo.url.substring(1) : photo.url}`;
        
        return (
          <div key={photo.id} className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="relative" style={{ paddingBottom: '66.67%' }}>
              <img
                src={imageUrl}
                alt={`Photo by ${photo.user_name || 'user'}`}
                className="absolute h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error("Error loading image:", imageUrl);
                  e.target.src = "https://via.placeholder.com/300x200?text=Image+Error"; // Gambar pengganti jika error
                }}
              />
            </div>
            <div className="p-4">
              {showUserName && photo.user_name && (
                <p className="text-sm font-medium text-gray-700 mb-1">
                  By: {photo.user_name}
                </p>
              )}
              <p className="text-sm text-gray-500">
                {photo.created_at ? new Date(photo.created_at).toLocaleDateString() : 'Unknown date'}
              </p>
              {onDelete && (
                <button
                  onClick={() => onDelete(photo.id)}
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Home() {
  const [publicPhotos, setPublicPhotos] = useState([]);
  const [myPhotos, setMyPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('public');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Fetch all public photos
  useEffect(() => {
    const fetchPublicPhotos = async () => {
      try {
        setLoading(true);
        const response = await photoService.getMyPhotos();
        console.log("API Response for public photos:", response);
        
        if (response && response.data) {
          setPublicPhotos(response.data);
        } else {
          console.warn("Invalid response format:", response);
          setError('Invalid response format from server.');
        }
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError(`Failed to load photos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPhotos();
  }, []);

  // Fetch user's own photos if authenticated
  useEffect(() => {
    const fetchMyPhotos = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await photoService.getMyPhotos();
        console.log("API Response for my photos:", response);
        
        if (response && response.data) {
          setMyPhotos(response.data);
        } else {
          console.warn("Invalid response format for my photos:", response);
        }
      } catch (err) {
        console.error('Error fetching user photos:', err);
      }
    };

    if (isAuthenticated) {
      fetchMyPhotos();
    }
  }, [isAuthenticated]);

  const handleDeletePhoto = async (photoId) => {
    if (!photoId) return;
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await photoService.deletePhoto(photoId);
        // Update both photo lists after deletion
        setMyPhotos(myPhotos.filter(photo => photo.id !== photoId));
        setPublicPhotos(publicPhotos.filter(photo => photo.id !== photoId));
      } catch (err) {
        console.error('Failed to delete photo:', err);
        alert('Failed to delete photo. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Photo Gallery</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'public' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('public')}
        >
          All My Photos
        </button>
        {isAuthenticated && (
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'my' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('my')}
          >
            My Photos
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {activeTab === 'public' && (
            <div>
              <p className="mb-4">Total public photos: {publicPhotos.length}</p>
              <ImageGrid photos={publicPhotos} showUserName={true} />
            </div>
          )}
          
          {activeTab === 'my' && (
            <div>
              <p className="mb-4">Total my photos: {myPhotos.length}</p>
              <ImageGrid photos={myPhotos} onDelete={handleDeletePhoto} showUserName={false} />
            </div>
          )}
        </>
      )}

      {!isAuthenticated && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-gray-700 mb-3">Log in to upload your own photos or manage your gallery.</p>
          <a 
            href="/login" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition-colors"
          >
            Log In
          </a>
        </div>
      )}
    </div>
  );
}

export default Home;
