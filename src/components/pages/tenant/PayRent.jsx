import { useState } from "react";
import { useFirebase } from "../../../context/FirebaseContext"
import { toast } from "react-toastify"

export default function PayRent() {
  const { rent, loading, payRent } = useFirebase();
  const [amount, setAmount] = useState("");

  if (loading) return <p>Loading Rent Info...</p>;
  if (!rent) return <p>No Rent Assigned</p>;
console.log("RENT DATA:", rent);
  const handlePay = async () => {
    if (!amount) {
      alert("Please enter amount");
      return;
    }

    try {
      await payRent(amount);
      toast("Rent Paid Successfully ✅ (Fake)");
    } catch {
      alert("Payment Failed ❌");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="font-bold mb-2">Pay Rent</h2>

      <p><b>Month:</b> {rent.month}</p>
      <p><b>Rent:</b> ₹{rent.amount}</p>
      <p><b>Status:</b> {rent.paid ? "Paid ✅" : "Pending ❌"}</p>


      {!rent.paid && (
        <>
          <input
            type="number"
            placeholder="Enter Amount"
            className="border p-2 w-full mt-3 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handlePay}
            className="bg-green-500 text-white px-4 py-2 mt-3 rounded w-full"
          >
            Pay Rent
          </button>
        </>
      )}

      {rent.paid && (
        <p className="mt-3 text-green-600">
          Paid ₹{rent.paidAmount} on {new Date(rent.paymentDate).toDateString()}
        </p>
      )}
    </div>
  );
}
