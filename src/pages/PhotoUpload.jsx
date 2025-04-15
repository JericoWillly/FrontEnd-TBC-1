import { useState } from 'react';
import { photoService } from '../services/api';

function PhotoUpload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      if (title) {
        formData.append('title', title);
      }
      
      if (description) {
        formData.append('description', description);
      }

      await photoService.uploadPhoto(formData);
      
      setSuccess(true);
      setFile(null);
      setTitle('');
      setDescription('');
      setPreview(null);
      
      // Reset file input
      const fileInput = document.getElementById('photo-upload');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Failed to upload photo:', err);
      setError(err.response?.data?.message || 'Failed to upload photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upload Photo</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Photo uploaded successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="photo-upload" className="block text-gray-700 mb-2">
            Select Photo:
          </label>
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
        </div>
        
        {preview && (
          <div className="mb-4">
            <p className="text-gray-700 mb-2">Preview:</p>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full max-h-80 object-contain border rounded" 
            />
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Title (optional):
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Description (optional):
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 h-32 resize-none"
            disabled={loading}
          />
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition-colors"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                Uploading...
              </span>
            ) : (
              'Upload Photo'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PhotoUpload;