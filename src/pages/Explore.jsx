import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { photoService } from "../services/api";

function Explore() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
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
          setError("Invalid data format");
        }
      } catch (err) {
        console.error("Error fetching top photos:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Explore Top Photos by Users</h1>

      <div className="grid gap-6">
        {users.map(
          (user) =>
            user.photos &&
            user.photos.length > 0 && (
              <div
                key={user.user_id}
                className="bg-white shadow rounded p-4 hover:shadow-lg transition-all duration-300 hover:cursor-pointer hover:scale-105"
                onClick={() => navigate(`/user/${user.user_id}`)}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">{user.user_name}</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from(
                    new Map(user.photos.map((p) => [p.id, p])).values()
                  )
                    .slice(0, 7)
                    .map((photo) => (
                      photo &&
                      photo.url && (
                        <img
                          key={`${user.user_id}-${photo.id}`}
                          src={`https://image-hosting.kuncipintu.my.id${photo.url}`}
                          alt={photo.title || "Photo"}
                          className="w-full h-32 object-cover rounded"
                        />
                      )
                    ))}
                </div>
              </div>
            )
        )}
      </div>

      {users.length > 10 && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default Explore;
