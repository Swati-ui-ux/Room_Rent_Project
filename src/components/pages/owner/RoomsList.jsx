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
import { toast } from "react-toastify";

export default function RoomList() {
  const { db, assignRoomToTenant, getRooms,setShowAddRoom, } = useFirebase();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [tenantDetails, setTenantDetails] = useState({});

  const [activeFloor, setActiveFloor] = useState(null);

  // 🔹 FETCH TENANT DETAILS (for booked rooms)
  const fetchTenantDetails = async (tenantId) => {
    try {
      const snap = await getDocs(
        query(collection(db, "users"), where("__name__", "==", tenantId))
      );

      if (!snap.empty) {
        setTenantDetails((prev) => ({
          ...prev,
          [tenantId]: snap.docs[0].data(),
        }));
      }
    } catch (err) {
      console.log("Tenant fetch error:", err);
    }
  };

  // 🔹 FETCH AVAILABLE TENANTS
  const fetchTenants = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "tenant")
      );

      const snap = await getDocs(q);

      const list = snap.docs.map((d) => ({
        uid: d.id,
        ...d.data(),
      }));

      setTenants(list);
    } catch (err) {
      console.log("Tenant list error:", err);
    }
  };

  // 🔹 LOAD ROOMS (FROM CONTEXT)
  const loadRooms = async () => {
    try {
      setLoading(true);
      setShowAddRoom(false)
      const list = await getRooms();
      setRooms(list);

      list.forEach((room) => {
        if (room.status === "booked" && room.tenantId) {
          fetchTenantDetails(room.tenantId);
        }
      });

      if (list.length) {
        setActiveFloor(list[0].floorNumber);
      }
    } catch (err) {
      console.log("Load rooms error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 INITIAL LOAD
  useEffect(() => {
    if (db) {
      loadRooms();
      fetchTenants();
    }
  }, [db]);

  // 🔹 ASSIGN TENANT
  const handleAssignTenant = async (roomId) => {
    if (!selectedTenant) {
      toast.error("Please select a tenant");
      return;
    }

    try {
      await assignRoomToTenant(roomId, selectedTenant);
      toast.success("Tenant assigned ✅");
      setSelectedTenant("");
      loadRooms();
    } catch {
      toast.error("Assign failed ❌");
    }
  };

  // 🔹 DELETE ROOM
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      await deleteDoc(doc(db, "rooms", id));
      setRooms((prev) => prev.filter((r) => r.id !== id));
      toast.success("Room deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <h2 className="p-6">Loading...</h2>;

  // 🔹 GROUP ROOMS BY FLOOR
  const floors = {};
  rooms.forEach((room) => {
    if (!floors[room.floorNumber]) floors[room.floorNumber] = [];
    floors[room.floorNumber].push(room);
  });

  const floorNumbers = Object.keys(floors)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Rooms</h1>

      {/* 🔘 FLOOR BUTTONS */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {floorNumbers.map((floor) => (
          <button
            key={floor}
            onClick={() => setActiveFloor(floor)}
            className={`px-4 py-2 rounded border text-sm ${
              activeFloor === floor
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Floor {floor}
          </button>
        ))}
      </div>

      {/* 🏠 ROOMS */}
      {activeFloor && floors[activeFloor] && (
        <div className="p-4">
         

          <div className="grid sm:w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {floors[activeFloor]
              .sort((a, b) => a.roomNumber - b.roomNumber)
              .map((room) => (
                <div
                  key={room.id}
                  className={`p-4 rounded shadow border ${
                    room.status === "booked"
                      ? "bg-gray-200"
                      : "bg-white"
                  }`}
                >
                  <h3 className="font-bold text-lg">{room.title}</h3>

                  <p className="text-sm">
                    <b>Status:</b>{" "}
                    {room.status === "booked" ? "Booked" : "Available"}
                  </p>

                  <p className="text-sm">
                    <b>Rent:</b> ₹{room.rent}
                  </p>

                  {room.images && (
                    <img
                      src={room.images}
                      alt=""
                      className="mt-2 rounded h-32 w-full object-cover"
                    />
                  )}

                  {/* 👤 TENANT INFO */}
                  {room.status === "booked" &&
                    tenantDetails[room.tenantId] && (
                      <div className="mt-2 text-sm">
                        <p>
                          <b>Tenant:</b>{" "}
                          {tenantDetails[room.tenantId].name}
                        </p>
                        <p>
                          <b>Email:</b>{" "}
                          {tenantDetails[room.tenantId].email}
                        </p>
                      </div>
                    )}

                  {/* 🔽 ASSIGN TENANT */}
                  {room.status !== "booked" && (
                    <>
                      <select
                        value={selectedTenant}
                        onChange={(e) =>
                          setSelectedTenant(e.target.value)
                        }
                        className="border p-2 rounded w-full mt-2"
                      >
                        <option value="">Select Tenant</option>
                        {tenants.map((t) => (
                          <option key={t.uid} value={t.uid}>
                            {t.name} ({t.email})
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          handleAssignTenant(room.id)
                        }
                        className="mt-2 w-full bg-black text-white py-1 rounded"
                      >
                        Assign Tenant
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDelete(room.id)}
                    className="mt-2 w-full bg-red-600 text-white py-1 rounded"
                  >
                    Delete Room
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {rooms.length === 0 && (
        <p className="text-gray-500">No rooms added yet.</p>
      )}
    </div>
  );
}
