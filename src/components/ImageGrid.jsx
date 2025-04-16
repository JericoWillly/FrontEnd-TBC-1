function ImageGrid({ photos, onDelete, showUserName = true }) {
  const baseUrl = 'https://image-hosting.kuncipintu.my.id';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="relative pb-2/3">
            <img
              src={`${baseUrl}/${photo.url}`}
              alt={`Photo by ${photo.user_name || 'user'}`}
              className="absolute h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x200?text=Image+Error";
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
              {new Date(photo.created_at).toLocaleDateString()}
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
      ))}
    </div>
  );
}

export default ImageGrid;
