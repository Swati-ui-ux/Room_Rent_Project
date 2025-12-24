import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFirebase } from "../../../context/FirebaseContext";
import { Link } from "react-router-dom"

const Payments = () => {
  const { db } = useFirebase();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const ownerId = auth.currentUser?.uid;

   
    if (!ownerId || !db) {
      console.log(" ownerId/db not ready");
      return;
    }

    const q = query(
      collection(db, "payments"),
      where("ownerId", "==", ownerId)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPayments(data);
    });

    return () => unsub();
  }, [db]);

  return (
    <div className="  bg-blue-500 w-full min-h-screen flex justify-center items-center">
      <div className="w-[400px] h-auto">
      <h2 className="text-xl font-bold mb-4">Payments</h2>

      {payments.length === 0 && <p>No payments yet</p>}

      {payments.map(p => (
        <div key={p.id} className="bg-green-100 p-3 mb-2 rounded">
          ✅ ₹{p.amount} received from <b>{p.tenantName}</b>
          <div className="text-sm text-gray-600">
            {p.month} {p.year}
          </div>
        </div>
      ))}
      
        <Link className="border p-1 px-4 rounded mt-4 " to="/owner/dashboard">Go Back</Link>
      </div>
    </div>
  );
};

export default Payments;
