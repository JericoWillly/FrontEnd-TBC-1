function ImageGrid({ photos, onDelete }) {
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
              />
            </div>
            <div className="p-4">
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