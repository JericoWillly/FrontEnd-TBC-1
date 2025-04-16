import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { photoService, userService } from '../services/api';
import ImageGrid from './ImageGrid';

function UserPhotoPage() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [userName, setUserName] = useState('');
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      const res = await photoService.getUserPhotos(userId, page);
      if (res.data.length < 1) setHasMore(false);
      setPhotos(prev => [...prev, ...res.data]);
    };

    const fetchUser = async () => {
      const res = await userService.getUserById(userId);
      setUserName(res.data.name || 'User');
    };

    fetchPhotos();
    fetchUser();
  }, [userId, page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Photos by {userName}</h1>
      <ImageGrid photos={photos} showUserName={false} />
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage(p => p + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default UserPhotoPage;
