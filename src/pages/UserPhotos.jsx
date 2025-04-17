import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import photoService from "../services/photoService";

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchUserPhotos = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await photoService.getUserPhotos(userId);
        const newPhotos = res.data || [];

        console.log("newPhotos", newPhotos);
        setPhotos(newPhotos);

        // if (page === 1) {
        //   setPhotos(newPhotos);
        // } else {
        //   setPhotos((prev) => [...prev, ...newPhotos]);
        // }

        // setHasMore(newPhotos.length > 0);
      } catch (err) {
        console.error("Error fetching user photos:", err);
        setError("Gagal mengambil foto.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPhotos();
  }, [userId]);

  // const loadMore = () => {
  //   if (hasMore) setPage((prev) => prev + 1);
  // };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-6">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Photos by User</h2>

      {photos.length === 0 ? (
        <p className="text-gray-500">User belum mengunggah foto.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <img
                key={photo.id}
                src={`https://image-hosting.kuncipintu.my.id${photo.url}`}
                alt={photo.title || "Photo"}
                className="w-full h-40 object-cover rounded"
              />
            ))}
          </div>

          {/* {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={loadMore}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Load More
              </button>
            </div>
          )} */}
        </>
      )}
    </div>
  );
}

export default UserPhotos;
