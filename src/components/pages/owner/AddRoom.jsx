import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useFirebase } from "../../../context/FirebaseContext";
import { ImCross } from "react-icons/im";
import { useSelector } from "react-redux";

export default function AddRoom() {
  const { addRoom, setShowAddRoom, showAddRoom, getRooms } = useFirebase();
  const auth = getAuth();
  const isDark = useSelector(state => state.theme.toggle);

  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [type, setType] = useState("1BHK");
  const [description, setDescription] = useState("");
  const [totalFloors, setTotalFloors] = useState(1);
  const [roomsPerFloor, setRoomsPerFloor] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "room_images");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/djkjbvbjh/image/upload",
      { method: "POST", body: data }
    );

    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uid = auth.currentUser.uid;
      const imageUrls = [];

      for (let img of images) {
        const url = await uploadImage(img);
        imageUrls.push(url);
      }

      let totalRoomsAdded = 0;

      for (let floor = 1; floor <= totalFloors; floor++) {
        for (let roomNum = 1; roomNum <= roomsPerFloor; roomNum++) {
          const roomData = {
            ownerId: uid,
            floorNumber: floor,
            roomNumber: roomNum,
            title: `Floor ${floor} - Room ${roomNum}`,
            location,
            rent,
            type,
            description,
            images: imageUrls,
            status: "available",
            createdAt: new Date(),
          };

          await addRoom(roomData);
          totalRoomsAdded++;
        }
      }

      setShowAddRoom(false);
      alert(`${totalRoomsAdded} Rooms Added Successfully 🎉`);
      getRooms();

      setLocation("");
      setRent("");
      setType("1BHK");
      setDescription("");
      setImages([]);
      setTotalFloors(1);
      setRoomsPerFloor(1);

    } catch (error) {
      console.log("Add Room Error:", error.message);
    }

    setLoading(false);
  };

  const handleClose = () => {
    setShowAddRoom((pre) => !pre);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        relative p-6 w-full max-w-lg rounded shadow
        ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}
      `}
    >
      <button
        type="button"
        className={`absolute top-4 right-4 ${isDark ? "text-white" : "text-blue-600"}`}
        onClick={handleClose}
      >
        <ImCross />
      </button>

      <h2 className={`text-2xl font-bold mb-4 text-center ${isDark ? "text-white" : "text-blue-700"}`}>
        Add Rooms
      </h2>

      <label className={`font-medium ${isDark ? "text-white" : "text-blue-600"}`}>Total Floors</label>
      <input
        type="number"
        className={`
          w-full p-2 mb-3 rounded focus:outline-none focus:ring-2
          ${isDark ? "border-gray-600 focus:ring-gray-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-500 bg-white text-black"}
        `}
        value={totalFloors}
        onChange={(e) => setTotalFloors(Number(e.target.value))}
        required
      />

      <label className={`font-medium ${isDark ? "text-white" : "text-blue-600"}`}>Rooms Per Floor</label>
      <input
        type="number"
        className={`
          w-full p-2 mb-3 rounded focus:outline-none focus:ring-2
          ${isDark ? "border-gray-600 focus:ring-gray-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-500 bg-white text-black"}
        `}
        value={roomsPerFloor}
        onChange={(e) => setRoomsPerFloor(Number(e.target.value))}
        required
      />

      <label className={`font-medium ${isDark ? "text-white" : "text-blue-600"}`}>Location</label>
      <input
        type="text"
        className={`
          w-full p-2 mb-3 rounded focus:outline-none focus:ring-2
          ${isDark ? "border-gray-600 focus:ring-gray-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-500 bg-white text-black"}
        `}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <label className={`font-medium ${isDark ? "text-white" : "text-blue-600"}`}>Rent Amount</label>
      <input
        type="number"
        className={`
          w-full p-2 mb-3 rounded focus:outline-none focus:ring-2
          ${isDark ? "border-gray-600 focus:ring-gray-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-500 bg-white text-black"}
        `}
        value={rent}
        onChange={(e) => setRent(e.target.value)}
        required
      />

      <label className={`font-medium ${isDark ? "text-white" : "text-blue-600"}`}>Room Type</label>
      <select
        className={`
          w-full p-2 mb-3 rounded focus:outline-none focus:ring-2
          ${isDark ? "border-gray-600 focus:ring-gray-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-500 bg-white text-black"}
        `}
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="1BHK">1BHK</option>
        <option value="2BHK">2BHK</option>
        <option value="PG">PG</option>
      </select>

      <label className={`font-medium ${isDark ? "text-white" : "text-blue-600"}`}>Description</label>
      <textarea
        className={`
          w-full p-2 mb-3 rounded focus:outline-none focus:ring-2
          ${isDark ? "border-gray-600 focus:ring-gray-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-500 bg-white text-black"}
        `}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className={`font-medium ${isDark ? "text-white" : "text-blue-600"}`}>Room Images</label>
      <input
        type="file"
        multiple
        onChange={(e) => setImages([...e.target.files])}
        className={`${isDark ? "text-white" : "text-blue-600"} w-full mb-3`}
      />

      <button
        disabled={loading}
        className={`
          w-full p-2 rounded hover:opacity-90
          ${isDark ? "bg-gray-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}
        `}
      >
        {loading ? "Adding Rooms..." : "Add Rooms"}
      </button>
    </form>
  );
}
