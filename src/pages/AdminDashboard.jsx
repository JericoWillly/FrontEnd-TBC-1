import { useEffect, useState } from 'react';
import { userService, photoService } from '../services/api';
import ImageGrid from '../components/ImageGrid'; // Kamu bisa ekstrak ImageGrid ke file terpisah jika belum

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getAllUsers();
        setUsers(res.data || []);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const res = selectedUser
          ? await photoService.getUserPhotos(selectedUser)
          : await photoService.getAllPhotos();
        setPhotos(res.data || []);
      } catch (err) {
        console.error('Error loading photos:', err);
        setError('Failed to load photos');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [selectedUser]);

  const handleUserSelect = (userId) => {
    setSelectedUser(userId || null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="mb-6">
        <label className="block mb-2 text-gray-700">Select User:</label>
        <select
          className="w-full md:w-1/3 px-3 py-2 border rounded"
          onChange={(e) => handleUserSelect(e.target.value)}
          value={selectedUser || ''}
        >
          <option value="">All Photos</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name || u.email || `User ${u.id}`}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <ImageGrid photos={photos} onDeletePhoto={null} />
      )}
    </div>
  );
}

export default AdminDashboard;
