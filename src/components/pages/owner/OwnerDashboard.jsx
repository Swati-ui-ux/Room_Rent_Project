import { useState, memo } from "react";
import { useFirebase } from "../../../context/FirebaseContext";
import { FaUserLarge } from "react-icons/fa6";
import { IoReorderThree } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import AddRoom from "./AddRoom";
import RoomList from "./RoomsList";
import { useDispatch, useSelector } from "react-redux"
import { toggleTheme } from "../../../features/themeSlice"
import { FaRegMoon } from "react-icons/fa";
import { IoIosSunny } from "react-icons/io";
const MemoRoomList = memo(RoomList);

export default function OwnerDashboard() {
  const {
    userData,
    uploadProfileImage,
    logOut,
    showAddRoom,
    setShowAddRoom,
  } = useFirebase();
  let isDark = useSelector(state => state.theme.toggle);
  let dispatch =  useDispatch()
  console.log(isDark)
  const [profileImage, setProfileImage] = useState(
    userData?.profileImage || null
  );
  const [uploading, setUploading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadProfileImage(file);
      setProfileImage(url);
      toast.success("Profile updated");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!userData) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  return (
    <>
      <div className={`flex justify-between items-center  bg-[#01062a]   ${isDark?`bg-[#00020c] border-b  border-b-black`:"bg-blue-500 border-b border-b-blue-700 "} text-white p-4 sticky top-0 z-40`}>
        
          <h1>I am <span className="underline">{userData.name} </span>Owner of this Dashboard </h1>
        
        
        <div className="flex justify-between items-center  "><button onClick={() => setIsSidebarOpen(true)}>
          <IoReorderThree className="cursor-pointer" size={30} />
        </button>
        <button className=" text-2xl ml-10 cursor-pointer" onClick={() => dispatch(toggleTheme())}>
         {isDark ?<FaRegMoon/>:<IoIosSunny/>}
        </button></div>
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-[280px] ${isDark?"bg-gray-800/90":"bg-blue-500"} text-white z-50
        transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <button className="cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
            <ImCross size={22} />
          </button>
        </div>

        <div className="flex items-center gap-4 px-4 py-6 border-b border-gray-700">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-700 group">
            {profileImage ? (
              <img src={profileImage} className="w-full h-full object-cover" />
            ) : (
              <FaUserLarge className="w-full h-full p-2" />
            )}
            <label className="absolute inset-0 bg-black/70 hidden group-hover:flex items-center justify-center text-xs">
              {uploading ? "Uploading..." : "Change"}
              <input hidden type="file" onChange={handleImageChange} />
            </label>
          </div>
          <div>
            <p>{userData.name}</p>
            <p className="text-xs text-black capitalize">{userData.role}</p>
          </div>
        </div>

        <div className="px-4 mt-6 space-y-3">
          <Link
            to="/owner/profile"
            onClick={() => setIsSidebarOpen(false)}
            className={`block px-3 py-2 ${isDark?"hover:bg-gray-900":"hover:bg-blue-600"} outline rounded`}
          >
            Profile
          </Link>
          <Link
            to="/owner/payment"
            onClick={() => setIsSidebarOpen(false)}
            className={`block px-3 py-2 ${isDark?"hover:bg-gray-900":"hover:bg-blue-600"} outline rounded`}
          >
            Payments
          </Link>
        </div>

        <div className="absolute bottom-6 w-full px-4">
          <button
            onClick={logOut}
            className="w-full bg-white text-black py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="flex justify-between">
          <Link
            to="/owner/payment"
            className=
    {` text-white
     ${isDark?'bg-gray-800':'bg-blue-500'}
    cursor-pointer 
    px-5 
    py-2 
    rounded
  `}
          >
            Show Payments
          </Link>
          <button
  onClick={() => setShowAddRoom(true)}
  className=
    {` text-white
     ${isDark?'bg-gray-800':'bg-blue-500'}
    cursor-pointer 
    px-5 
    py-2 
    rounded
  `}
>
  + Add Room
</button>
        </div>

        <MemoRoomList />
      </div>

      {showAddRoom && (
        <div
          onClick={() => setShowAddRoom(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
        >
          <div  onClick={(e) => e.stopPropagation()}>
            <AddRoom />
          </div>
        </div>
      )}
    </>
  );
}
