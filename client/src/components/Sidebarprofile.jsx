import React from "react";

const SidebarProfile = ({ 
  userData, 
  setUserData, 
  Icons, 
  size = 130,
  width,
  height 
}) => {

  // Fallback if Icons or Icons.Edit is missing
  const EditIcon = Icons?.Edit ? Icons.Edit : () => <></>;

  const finalWidth = width || size;
  const finalHeight = height || size;

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
        {userData.avatar ? (
          <img
            src={userData.avatar}
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

        {/* SAFE EDIT BUTTON */}
        <button
          onClick={() => document.getElementById("avatarUpload").click()}
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
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onloadend = () => {
            setUserData((prev) => ({
              ...prev,
              avatar: reader.result,
            }));
            localStorage.setItem("profileImage", reader.result);
          };
          reader.readAsDataURL(file);
        }}
      />

      {/* User Info */}
      <h2 className="text-lg font-bold mt-4 text-center">{userData.name}</h2>
      <p className="text-[#5b3d25]/70 text-sm text-center">{userData.email}</p>
    </div>
  );
};

export default SidebarProfile;
