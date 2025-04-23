import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import photoService from "../services/photoService";
import { Camera, User, Image as ImageIcon, Loader } from "lucide-react";

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const fetchUserPhotos = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await photoService.getUserPhotos(userId);
        const newPhotos = res.data || [];
        console.log("newPhotos", newPhotos);
        
        // Add a small delay before revealing photos for smooth loading transition
        setTimeout(() => {
          setPhotos(newPhotos);
          setLoading(false);
          setTimeout(() => setAnimateIn(true), 100);
        }, 300);
      } catch (err) {
        console.error("Error fetching user photos:", err);
        setError("Gagal mengambil foto.");
        setLoading(false);
      }
    };

    fetchUserPhotos();
    return () => setAnimateIn(false);
  }, [userId]);

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = "hidden";
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = "auto";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Mengambil galeri foto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-3xl mx-auto my-8">
        <div className="text-red-500 text-lg font-medium mb-2">{error}</div>
        <p className="text-gray-600">Silakan coba lagi nanti.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center space-x-2 mb-6 border-b pb-4">
        <Camera className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Galeri Foto</h2>
      </div>

      {photos.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-10 text-center">
          <div className="flex justify-center mb-4">
            <ImageIcon className="w-16 h-16 text-gray-300" />
          </div>
          <p className="text-gray-500 text-lg">User belum mengunggah foto.</p>
        </div>
      ) : (
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
          {photos.map((photo, index) => (
            <div 
              key={photo.id} 
              className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              style={{ 
                animationDelay: `${index * 50}ms`,
                transform: animateIn ? 'translateY(0)' : 'translateY(20px)',
                opacity: animateIn ? 1 : 0,
                transition: 'transform 0.4s ease, opacity 0.4s ease'
              }}
              onClick={() => openPhotoModal(photo)}
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={`https://image-hosting.kuncipintu.my.id${photo.url}`}
                  alt={photo.title || "Photo"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-3 w-full">
                  <p className="text-white font-medium truncate text-sm">
                    {photo.title || "Untitled Photo"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closePhotoModal}>
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`https://image-hosting.kuncipintu.my.id${selectedPhoto.url}`}
              alt={selectedPhoto.title || "Photo"}
              className="w-full h-auto max-h-[90vh] object-contain rounded shadow-2xl"
            />
            <button 
              className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70"
              onClick={closePhotoModal}
            >
              ✕
            </button>
            {selectedPhoto.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 rounded-b">
                <h3 className="font-medium">{selectedPhoto.title}</h3>
                {selectedPhoto.description && (
                  <p className="text-sm text-gray-200 mt-1">{selectedPhoto.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPhotos;
