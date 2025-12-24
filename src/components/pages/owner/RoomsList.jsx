import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useFirebase } from "../../../context/FirebaseContext";
import { toast } from "react-toastify";
import { useSelector } from "react-redux"

export default function RoomList() {
  const { db, assignRoomToTenant, getRooms,setShowAddRoom, } = useFirebase();
  let isDark = useSelector(state=>state.theme.toggle)
  
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [tenantDetails, setTenantDetails] = useState({});

  const [activeFloor, setActiveFloor] = useState(null);

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

  
  useEffect(() => {
    if (db) {
      loadRooms();
      fetchTenants();
    }
  }, [db]);

 
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


  if (loading) return <h2 className="p-6">Loading...</h2>;

 
  const floors = {};
  rooms.forEach((room) => {
    if (!floors[room.floorNumber]) floors[room.floorNumber] = [];
    floors[room.floorNumber].push(room);
  });

  const floorNumbers = Object.keys(floors)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="p-2">
      <h1 className="text-2xl  font-bold mb-4">My Rooms</h1>

     
      <div className="flex gap-3 mb-6 flex-wrap">
        {floorNumbers.map((floor) => (
          <button
            key={floor}
            onClick={() => setActiveFloor(floor)}
            className={`px-4 py-2 rounded border text-sm ${
  activeFloor === floor
    ? `${isDark ? "bg-gray-900 text-white" : "bg-blue-500 text-white"}`
    : `${isDark ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-blue-500 hover:bg-gray-100"}`
}`}


          >
            Floor {floor}
          </button>
        ))}
      </div>

      
      {activeFloor && floors[activeFloor] && (
        <div className="p-4 sm:p-1">
         

          <div className="grid sm:w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {floors[activeFloor]
              .sort((a, b) => a.roomNumber - b.roomNumber)
              .map((room) => (
                <div
                  key={room.id}
                  className={`p-4 sm:w-full rounded border shadow ${isDark?"border-gray-700":"border-blue-300"} ${
                    room.status === "booked"
                      ? `${isDark?"bg-gray-500":"bg-blue-200"}`
                      : `${isDark?"bg-gray-400":"bg-white"}`
                  }`}
                >
                  <h3 className="font-bold text-lg">{room.title}</h3>

                  <p className="text-sm">
                    <b>Status:</b>{' '}
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

                  
                  {room.status !== "booked" && (
                    <>
                      <select
                        value={selectedTenant}
                        onChange={(e) =>
                          setSelectedTenant(e.target.value)
                        }
                        className={`border ${isDark?'border-gray-700':'border-blue-400'}  p-2 rounded w-full mt-2`}
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
                        className={`mt-2 w-full ${isDark?"bg-gray-800":"bg-blue-500"} text-white py-1 rounded`}
                      >
                        Assign Tenant
                      </button>
                    </>
                  )}

                  
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
