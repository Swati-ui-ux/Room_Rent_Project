import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export default function AssignRoom() {
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);

  const [selectedTenant, setSelectedTenant] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      const tenantSnap = await getDocs(collection(db, "tenants"));
      const tenantList = tenantSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      const roomSnap = await getDocs(collection(db, "rooms"));
      const roomList = roomSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setTenants(tenantList);
      setFilteredTenants(tenantList);
      setRooms(roomList);
    };

    fetchData();
  }, []);

  // ✅ SEARCH FILTER
  useEffect(() => {
    const result = tenants.filter((tenant) =>
      tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTenants(result);
  }, [searchTerm, tenants]);

  // ✅ ASSIGN ROOM
  const handleAssign = async () => {
    if (!selectedTenant || !selectedRoom) {
      alert("Please select tenant and room");
      return;
    }

    try {
      await updateDoc(doc(db, "tenants", selectedTenant), {
        roomId: selectedRoom
      });

      await updateDoc(doc(db, "rooms", selectedRoom), {
        status: "occupied"
      });

      alert("✅ Room Assigned Successfully");
      setSelectedTenant("");
      setSelectedRoom("");
      setSearchTerm("");
    } catch (error) {
      console.error("Assign Room Error:", error);
      alert("❌ Failed to assign room");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow mt-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Assign Room to Tenant</h2>

      {/* ✅ SEARCH TENANT */}
      <input
        className="w-full border p-2 mb-3"
        placeholder="Search tenant by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* ✅ SELECT TENANT */}
      <select
        className="w-full border p-2 mb-4"
        value={selectedTenant}
        onChange={(e) => setSelectedTenant(e.target.value)}
      >
        <option value="">Select Tenant</option>
        {filteredTenants.map((tenant) => (
          <option key={tenant.id} value={tenant.id}>
            {tenant.name} ({tenant.email})
          </option>
        ))}
      </select>

      {/* ✅ SELECT ROOM */}
      <select
        className="w-full border p-2 mb-4"
        value={selectedRoom}
        onChange={(e) => setSelectedRoom(e.target.value)}
      >
        <option value="">Select Room</option>
        {rooms
          .filter((room) => room.status === "vacant")
          .map((room) => (
            <option key={room.id} value={room.id}>
              Room {room.roomNumber} - ₹{room.rent}
            </option>
          ))}
      </select>

      {/* ✅ BUTTON */}
      <button
        onClick={handleAssign}
        className="bg-black text-white px-6 py-2 rounded w-full"
      >
        Assign Room
      </button>
    </div>
  );
}
