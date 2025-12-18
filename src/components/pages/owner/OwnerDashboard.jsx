import { useState } from "react";
import { useFirebase } from "../../../context/FirebaseContext";
import { FaUserLarge } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import AddRoom from "./AddRoom";
import RoomList from "./RoomsList";

import { memo } from "react";

// ✅ memo OUTSIDE component
const MemoRoomList = memo(RoomList);

export default function OwnerDashboard() {
  const { userData, uploadProfileImage, logOut ,showAddRoom,setShowAddRoom} = useFirebase();

  const [profileImage, setProfileImage] = useState(
    userData?.profileImage || null
  );
  const [uploading, setUploading] = useState(false);
 

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageURL = await uploadProfileImage(file);
      setProfileImage(imageURL);
      toast.success("Profile image updated");
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!userData) {
    return (
      <h2 className="text-center mt-10 text-xl font-semibold">
        Loading Dashboard...
      </h2>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      
      {/* Navbar */}
      <nav className="bg-black text-white sticky top-0 z-40 shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 group cursor-pointer">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserLarge className="w-full h-full p-2 text-gray-300" />
              )}

              <label className="absolute inset-0 bg-black/70 hidden group-hover:flex items-center justify-center text-xs cursor-pointer">
                {uploading ? "Uploading..." : "Change"}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div>
              <p className="font-semibold">{userData.name}</p>
              <p className="text-xs text-gray-400 capitalize">
                {userData.role}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              to="/owner/profile"
              className="text-sm font-medium text-gray-300 hover:text-white"
            >
              Profile
            </Link>

            <button
              onClick={logOut}
              className="px-4 py-1.5 rounded-md text-sm font-medium bg-white text-black hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        <div className="flex justify-between items-center">
          <Link
            to="/owner/payment"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Show Payments
          </Link>

          <button
            onClick={() => setShowAddRoom(true)}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            + Add Room
          </button>
        </div>

        {/* Room List */}
        <MemoRoomList  />
      </div>

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <AddRoom  />
        </div>
      )}
    </div>
  );
}
