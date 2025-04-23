import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { photoService } from "../services/api";
import { User, Camera, Image, Loader, ChevronRight } from "lucide-react";

function Explore() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");
      
      try {
        const response = await photoService.getTopPhotosByUsers(page);
        console.log("Top photos response:", response);

        if (response && response.data && Array.isArray(response.data.data)) {
          const formattedUsers = response.data.data.map((item) => ({
            user_id: item.user.id,
            user_name: item.user.name,
            photos: item.photos,
          }));

          // Hindari duplikasi user berdasarkan user_id
          setUsers((prevUsers) => {
            const existingUserIds = new Set(prevUsers.map((u) => u.user_id));
            const uniqueNewUsers = formattedUsers.filter(
              (u) => !existingUserIds.has(u.user_id)
            );
            return [...prevUsers, ...uniqueNewUsers];
          });
        } else {
          setError("Format data tidak valid");
        }
      } catch (err) {
        console.error("Error fetching top photos:", err);
        setError("Gagal mengambil data.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setInitialLoad(false);
      }
    };

    fetchPhotos();
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const navigateToUserGallery = (userId, event) => {
    event.stopPropagation();
    navigate(`/user/${userId}`);
  };

  if (initialLoad && loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Mengambil galeri foto...</p>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-lg font-medium mb-2">{error}</div>
          <p className="text-gray-600">Silakan coba lagi nanti.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center mb-8 border-b pb-4">
        <Image className="w-7 h-7 text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">Eksplorasi Foto</h1>
      </div>

      {users.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-10 text-center">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Belum ada foto untuk ditampilkan.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {users.map(
            (user) =>
              user.photos &&
              user.photos.length > 0 && (
                <div
                  key={user.user_id}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <User className="w-5 h-5 text-blue-700" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">{user.user_name}</h2>
                    </div>
                    <button 
                      onClick={(e) => navigateToUserGallery(user.user_id, e)}
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                      Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {Array.from(
                        new Map(user.photos.map((p) => [p.id, p])).values()
                      )
                        .slice(0, 8)
                        .map((photo, index) => (
                          photo &&
                          photo.url && (
                            <div 
                              key={`${user.user_id}-${photo.id}`}
                              className="aspect-[4/3] overflow-hidden rounded shadow-sm hover:shadow group relative cursor-pointer"
                              onClick={(e) => navigateToUserGallery(user.user_id, e)}
                              style={{
                                animationDelay: `${index * 50}ms`,
                                animation: initialLoad ? 'fadeIn 0.5s ease forwards' : 'none'
                              }}
                            >
                              <img
                                src={`https://image-hosting.kuncipintu.my.id${photo.url}`}
                                alt={photo.title || "Photo"}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                              {photo.title && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                  <p className="text-white text-sm p-2 truncate">{photo.title}</p>
                                </div>
                              )}
                            </div>
                          )
                        ))}
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      )}

      {users.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center mx-auto disabled:bg-blue-400"
          >
            {loadingMore ? (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Memuat...
              </>
            ) : (
              "Muat Lebih Banyak"
            )}
          </button>
        </div>
      )}

      {error && users.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-center rounded">
          {error} <button onClick={loadMore} className="underline ml-2">Coba lagi</button>
        </div>
      )}
    </div>
  );
}

export default Explore;
