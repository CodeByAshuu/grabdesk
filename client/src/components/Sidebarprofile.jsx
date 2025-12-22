import React, { useState } from "react";
import api from "../api/axios";

const SidebarProfile = ({
  userData,
  setUserData,
  Icons,
  size = 130,
  width,
  height
}) => {
  const [uploading, setUploading] = useState(false);

  // Fallback if Icons or Icons.Edit is missing
  const EditIcon = Icons?.Edit ? Icons.Edit : () => <></>;

  const finalWidth = width || size;
  const finalHeight = height || size;

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        // Immediate UI update for responsiveness (optimistic update)
        const tempAvatar = base64Image;
        setUserData(prev => ({ ...prev, avatar: tempAvatar }));

        try {
          // Upload to backend (Cloudinary)
          const response = await api.post('/users/profile-picture', {
            image: base64Image
          });

          if (response.data.success) {
            // Update with Cloudinary URL (permanent)
            setUserData(prev => ({
              ...prev,
              avatar: response.data.profilePhotoUrl,
              profilePhotoUrl: response.data.profilePhotoUrl
            }));
          }
        } catch (error) {
          console.error('Upload failed:', error);
          // On error, revert to old avatar or leave optimistic update
          alert('Failed to upload profile picture. Please try again.');
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        setUploading(false);
        alert('Failed to read image file');
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Profile picture processing error:', error);
      setUploading(false);
      alert('Error processing image');
    }
  };

  return (
    <div className="flex flex-col items-center mb-6 w-full">

      {/* Avatar Container */}
      <div
        className="
          relative 
          rounded-full 
          overflow-hidden 
          border-4 border-[#5b3d25] 
          bg-[#5b3d25]/10
          max-w-full
        "
        style={{
          width: finalWidth,
          height: finalHeight,
        }}
      >
        {/* Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {userData.avatar || userData.profilePhotoUrl ? (
          <img
            src={userData.avatar || userData.profilePhotoUrl}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `data:image/svg+xml,
              %3Csvg xmlns='http://www.w3.org/2000/svg' width='${finalWidth}' height='${finalHeight}'
              viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%235b3d25'/%3E
              %3Ctext x='50%25' y='50%25' font-family='Arial' font-size='40' fill='white' 
              text-anchor='middle' dy='.3em'%3E${userData.name
                  .charAt(0)
                  .toUpperCase()}%3C/text%3E%3C/svg%3E`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
            {userData.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* EDIT BUTTON */}
        <button
          onClick={() => !uploading && document.getElementById("avatarUpload").click()}
          disabled={uploading}
          className="
            absolute 
            bottom-1 
            right-1 
            bg-[#5b3d25] 
            text-white 
            p-1.5 
            rounded-full 
            hover:bg-[#4a3120]
            transition
            shadow
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <EditIcon />
        </button>
      </div>

      <input
        id="avatarUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageUpload(e.target.files?.[0])}
        disabled={uploading}
      />

      {/* User Info */}
      <h2 className="text-lg font-bold mt-4 text-center">{userData.name}</h2>
      <p className="text-[#5b3d25]/70 text-sm text-center">{userData.email}</p>
    </div>
  );
};

export default SidebarProfile;
