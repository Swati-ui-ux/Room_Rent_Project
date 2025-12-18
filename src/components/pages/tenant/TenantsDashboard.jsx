import React, { useEffect, useState } from "react";
import { useFirebase } from "../../../context/FirebaseContext";
import { FaUserLarge } from "react-icons/fa6";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore"
import { Link } from "react-router-dom";
import PayRent from "./PayRent"
export const TenantsDashboard = () => {
  const { userData, db,uploadProfileImage,logOut } = useFirebase();
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
 const [room, setRoom] = useState(null);
  // sync image when userData comes from context
  useEffect(() => {
    if (userData?.profileImage) {
      setProfileImage(userData.profileImage);
    }
  }, [userData]);
useEffect(() => {
    if (userData?.assignedRoomId) {
      fetchRoom();
    }
  }, [userData]);
  // upload handler
 const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    setUploading(true);
    const imageURL = await uploadProfileImage(file); // no uid
    setProfileImage(imageURL);
    toast.success("Profile image updated ✅");
  } catch (error) {
    console.error(error);
    toast.error("Image upload failed ❌");
  } finally {
    setUploading(false);
  }
};

  const fetchRoom = async () => {
    const roomRef = doc(db, "rooms", userData.assignedRoomId);
    const snap = await getDoc(roomRef);
    if (snap.exists()) setRoom(snap.data());
  };

  if (!userData) return <h2>Loading...</h2>;

  if (!userData) {
    return (
      <h2 className="text-center mt-10 text-xl font-semibold">
        Loading Tenant Dashboard...
      </h2>
    );
  }

  return (
    <>
    <div className="min-h-auto bg-gray-100">
      {/* 🔹 NAVBAR */}
      <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-4">
          {/* Profile Image */}
          <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center group">
            {profileImage ? (
              <img
                src={profileImage}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUserLarge size={28} />
            )}

            {/* Upload on hover */}
           <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-xs">
  {uploading ? "Uploading..." : "Change"}

  <input
    type="file"
    accept="image/*"
    className="absolute  inset-0 opacity-0 cursor-pointer"
    onChange={handleImageChange}
  />
</div>

          </div>

          <span className="font-medium">{userData.name}</span>
          </div>
          <Link
            to="/tenant/profile"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
            
          >
              Profile
          </Link>
          

            <button
              onClick={logOut}
              className="px-4 py-1.5 rounded-md text-sm font-medium bg-white text-black hover:bg-gray-200 transition"
            >
              Logout
            </button>
        </nav>
        
        

    
      </div>
      <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tenant Room Detail</h1>
        {room ? (
          <div className="border p-4 rounded">
            <h2 className="font-semibold">{room.title}</h2>
            <p>Rent: ₹{room.rent}</p>
            <p>Location: {room.location}</p>
            <p>Status: {room.status}</p>
          </div>
        ) : (
          <p>No room assigned yet</p>
        )}
        <PayRent />
      </div>
</>
  );
};

export default TenantsDashboard;



