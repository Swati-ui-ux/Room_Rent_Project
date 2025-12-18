import { useState, memo } from "react";
import { useFirebase } from "../../../context/FirebaseContext";
import { FaUserLarge } from "react-icons/fa6";
import { IoReorderThree } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import AddRoom from "./AddRoom";
import RoomList from "./RoomsList";

// memo
const MemoRoomList = memo(RoomList);

export default function OwnerDashboard() {
  const {
    userData,
    uploadProfileImage,
    logOut,
    showAddRoom,
    setShowAddRoom,
  } = useFirebase();

  const [profileImage, setProfileImage] = useState(
    userData?.profileImage || null
  );
  const [uploading, setUploading] = useState(false);

 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <>
      {/* ================= TOP BAR ================= */}
      <div className="flex justify-between items-center bg-black text-white p-4 sticky top-0 z-40">
        <h2 className="font-semibold">Owner Dashboard</h2>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="cursor-pointer"
        >
          <IoReorderThree size={30} />
        </button>
      </div>

      
      <div
        className={`
          fixed top-0 left-0 h-full w-[260px] bg-black/80 text-white z-50
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            className="cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            <ImCross size={22} />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 px-4 py-6 border-b border-gray-700">
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
              <input type="file" hidden onChange={handleImageChange} />
            </label>
          </div>

          <div>
            <p className="font-semibold">{userData.name}</p>
            <p className="text-xs text-gray-400 capitalize">
              {userData.role}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="px-4 space-y-3 mt-6">
          <Link
            to="/owner/profile"
            className="block px-3 py-2 rounded hover:bg-gray-800"
          >
            Profile
          </Link>

          <Link
            to="/owner/payment"
            className="block px-3 py-2 rounded hover:bg-gray-800"
          >
            Payments
          </Link>
        </div>

        {/* Logout */}
        <div className="absolute bottom-6 w-full px-4">
          <button
            onClick={logOut}
            className="w-full py-2 rounded bg-white text-black font-medium hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </div>

   
      <div
        className={`transition-all duration-300 px-6 py-6 space-y-6
          ${isSidebarOpen ? "ml-[260px]" : "ml-0"}
        `}
      >
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

        <MemoRoomList />
      </div>

    
      {showAddRoom && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <AddRoom />
        </div>
      )}
    </>
  );
}
