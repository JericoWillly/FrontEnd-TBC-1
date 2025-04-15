import { useAuth } from '../contexts/AuthContext';

function UserProfilePicture() {
  const { currentUser } = useAuth();

  if (!currentUser?.profilePicture) return null;

  return (
    <img
      src={`https://image-hosting.kuncipintu.my.id${currentUser.profilePicture}`}
      alt="Profile"
      className="w-10 h-10 object-cover rounded-full border"
    />
  );
}

export default UserProfilePicture;
