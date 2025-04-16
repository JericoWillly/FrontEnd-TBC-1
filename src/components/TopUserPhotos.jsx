import { useState, useEffect } from 'react';
import { photoService } from '../services/api';

function TopUserPhotos() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch top users dan foto-foto mereka
  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        const response = await photoService.getTopUsers(); // Anda bisa menyesuaikan endpoint jika diperlukan
        if (response && response.data) {
          setTopUsers(response.data);
        } else {
          setError('Invalid response format from server.');
        }
      } catch (err) {
        setError(`Failed to load top users: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-4">Top Users and Their Photos</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {topUsers.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
              <div className="grid grid-cols-3 gap-4">
                {user.photos.slice(0, 7).map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={`https://image-hosting.kuncipintu.my.id/${photo.url}`}
                      alt={`Photo by ${user.name}`}
                      className="w-full h-32 object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <a
                href={`/photos/user/${user.id}`}
                className="text-blue-500 hover:underline mt-4 inline-block"
              >
                View more photos
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopUserPhotos;
