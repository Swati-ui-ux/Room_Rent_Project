import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useFirebase } from "../../../context/FirebaseContext";
import { ImCross } from "react-icons/im";

export default function AddRoom() {
  const {addRoom,setShowAddRoom,showAddRoom,getRooms} = useFirebase();
  const auth = getAuth();

  // 🔥 Main Inputs
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [type, setType] = useState("1BHK");
  const [description, setDescription] = useState("");

  // 🔥 Floors & rooms
  const [totalFloors, setTotalFloors] = useState(1);
  const [roomsPerFloor, setRoomsPerFloor] = useState(1);

  // 🔥 Images
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cloudinary image upload
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "room_images");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/djkjbvbjh/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uid = auth.currentUser.uid;

      // Upload all images only once
      const imageUrls = [];
      for (let img of images) {
        const url = await uploadImage(img);
        imageUrls.push(url);
      }

      let totalRoomsAdded = 0;

      // 🔥 AUTO ROOM CREATION LOOP
      for (let floor = 1; floor <= totalFloors; floor++) {
        for (let roomNum = 1; roomNum <= roomsPerFloor; roomNum++) {
          const roomData = {
            ownerId: uid,
            floorNumber: floor,
            roomNumber: roomNum,
            title: `Floor ${floor} - Room ${roomNum}`,  // Auto Title
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
      setShowAddRoom(false)
      alert(`${totalRoomsAdded} Rooms Added Successfully 🎉`);
      getRooms()
      // Reset
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
  let handleClose = () => {
    setShowAddRoom((pre) => !pre)
    console.log(showAddRoom)
  }
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white relative p-6 w-full max-w-lg rounded shadow"
    >
      <button type="button" className="absolute top-4 right-4" onClick={handleClose}><ImCross/></button>
        <h2 className="text-2xl font-bold mb-4 text-center">Add Rooms</h2>

        {/* Floors */}
        <input
          type="number"
          placeholder="Total Floors"
          className="w-full border p-2 mb-3 rounded"
          value={totalFloors}
          onChange={(e) => setTotalFloors(Number(e.target.value))}
          required
        />

        {/* Rooms per floor */}
        <input
          type="number"
          placeholder="Rooms Per Floor"
          className="w-full border p-2 mb-3 rounded"
          value={roomsPerFloor}
          onChange={(e) => setRoomsPerFloor(Number(e.target.value))}
          required
        />

        {/* Location */}
        <input
          type="text"
          placeholder="Location"
          className="w-full border p-2 mb-3 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        {/* Rent */}
        <input
          type="number"
          placeholder="Rent Amount"
          className="w-full border p-2 mb-3 rounded"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          required
        />

        {/* Type */}
        <select
          className="w-full border p-2 mb-3 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="1BHK">1BHK</option>
          <option value="2BHK">2BHK</option>
          <option value="PG">PG</option>
        </select>

        <textarea
          placeholder="Room Description"
          className="w-full border p-2 mb-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* Images */}
        <input
          type="file"
          multiple
          onChange={(e) => setImages([...e.target.files])}
          className="w-full mb-3"
        />

        <button
          disabled={loading}
          className="bg-black text-white w-full p-2 rounded hover:bg-gray-800"
        >
          {loading ? "Adding Rooms..." : "Add Rooms"}
        </button>
      </form>
   
</>
  );
}
