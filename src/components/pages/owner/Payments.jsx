import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFirebase } from "../../../context/FirebaseContext";

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
    <div>
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
    </div>
  );
};

export default Payments;
