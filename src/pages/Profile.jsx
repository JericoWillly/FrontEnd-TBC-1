import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService, photoService } from '../services/api';
import ImageGrid from '../components/ImageGrid';

function Profile() {
  const { currentUser } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setProfilePicture(currentUser.profile_picture || null);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await photoService.getMyPhotos();
        setPhotos(response.data);
      } catch (err) {
        console.error('Failed to fetch photos:', err);
        setError('Failed to load your photos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setUpdateLoading(true);
    setError('');
    setSuccess('');

    const updateData = { name, email };
    if (password) updateData.password = password;

    try {
      await userService.updateProfile(updateData);
      setSuccess('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleProfilePicChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleProfilePicUpload = async (e) => {
    e.preventDefault();
    if (!profilePicture) {
      setError('Please select a profile picture');
      return;
    }

    setUploadingProfilePic(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      await userService.updateProfilePicture(formData);
      setSuccess('Profile picture updated successfully');
      await userService.getProfile(); // Refresh user data
    } catch (err) {
      console.error('Profile picture update failed:', err);
      setError(err.response?.data?.message || 'Failed to update profile picture');
    } finally {
      setUploadingProfilePic(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      await photoService.uploadPhoto(formData);
      setSuccess('Photo uploaded successfully');
      setSelectedFile(null);

      const response = await photoService.getMyPhotos();
      setPhotos(response.data);

      const fileInput = document.getElementById('photo-upload');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Photo upload failed:', err);
      setError(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await photoService.deletePhoto(photoId);
      setPhotos(photos.filter(photo => photo.id !== photoId));
      setSuccess('Photo deleted successfully');
    } catch (err) {
      console.error('Failed to delete photo:', err);
      setError('Failed to delete photo. Please try again.');
    }
  };

  return (
    <div className="mt-24 mb-10 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">My Profile</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {/* Profile Info */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 mb-1">Password (optional)</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={!password}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                type="submit"
                disabled={updateLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                {updateLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Profile Picture */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Profile Picture</h2>
            {currentUser?.profile_picture && (
              <div className="mb-4 flex justify-center">
                <img
                  src={`https://image-hosting.kuncipintu.my.id${currentUser.profilePicture}`}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full border-4 border-blue-300 shadow-md"
                />
              </div>
            )}
            <form onSubmit={handleProfilePicUpload}>
              <div className="mb-4">
                <label htmlFor="profile-pic" className="block text-gray-700 mb-1">Select New Picture</label>
                <input
                  id="profile-pic"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                disabled={uploadingProfilePic}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                {uploadingProfilePic ? 'Uploading...' : 'Update Picture'}
              </button>
            </form>
          </div>

          {/* Upload Photo */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Upload Photo</h2>
            <form onSubmit={handlePhotoUpload}>
              <div className="mb-4">
                <label htmlFor="photo-upload" className="block text-gray-700 mb-1">Select Photo</label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </form>
          </div>
        </div>

        {/* My Photos */}
        <div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">My Photos</h2>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading photos...</div>
            ) : photos.length > 0 ? (
              <ImageGrid photos={photos} onDelete={handleDeletePhoto} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No photos uploaded yet.</p>
                <p className="text-sm mt-2">Upload your first photo using the form on the left.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
