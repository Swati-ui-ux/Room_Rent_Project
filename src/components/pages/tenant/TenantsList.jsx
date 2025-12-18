import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useFirebase } from "../../../context/FirebaseContext";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

export default function RoomList() {
  const {
    db,
    getTenants,
    assignRoomToTenant,
  } = useFirebase();

  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [loading, setLoading] = useState(true);

  //  FETCH ROOMS
  const fetchRooms = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "rooms"),
      where("ownerId", "==", user.uid)
    );

    const snapshot = await getDocs(q);
    setRooms(
      snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    );
    setLoading(false);
  };

  //  FETCH TENANTS
  const fetchTenants = async () => {
    const data = await getTenants();
    setTenants(data);
  };

  useEffect(() => {
    fetchRooms();
    fetchTenants();
  }, []);

  //  ASSIGN TENANT
  const handleAssign = async (roomId) => {
    if (!selectedTenant) {
      toast.error("Select tenant first");
      return;
    }

    try {
      await assignRoomToTenant(roomId, selectedTenant);
      toast.success("Room assigned successfully ✅");
      setSelectedTenant("");
      fetchRooms();
    } catch (err) {
      toast.error("Assignment failed ❌");
    }
  };

  //  DELETE ROOM
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    await deleteDoc(doc(db, "rooms", id));
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  if (loading) return <h2 className="p-6">Loading...</h2>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Rooms</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div
            key={room.id}
            className="bg-white p-4 rounded shadow border"
          >
            <h2 className="font-bold">{room.title}</h2>
            <p>Rent: ₹{room.rent}</p>
            <p>Status: {room.status}</p>

            {/* 🔹 ASSIGN TENANT */}
            {room.status === "available" && (
              <>
                <select
                  className="border p-1 mt-2 w-full"
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                >
                  <option value="">Select Tenant</option>
                  {tenants.map(t => (
                    <option key={t.uid} value={t.uid}>
                      {t.name} ({t.phone})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleAssign(room.id)}
                  className="mt-2 w-full bg-green-600 text-white py-1 rounded"
                >
                  Assign Room
                </button>
              </>
            )}

            <button
              onClick={() => handleDelete(room.id)}
              className="mt-2 w-full bg-red-600 text-white py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
