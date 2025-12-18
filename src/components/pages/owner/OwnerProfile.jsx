import React from "react";
import { useFirebase } from "../../../context/FirebaseContext";
import { Link } from "react-router-dom";
const OwnerProfile = () => {
  const { userData } = useFirebase();

  if (!userData) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-linear-to-r from-gray-600 to-black p-6 text-center">
          <img
            src={userData.profileImage}
            alt="profile"
            className="w-28 h-28 mx-auto rounded-full border-4 border-white shadow-md object-cover"
          />
          <h2 className="text-white text-2xl font-bold mt-3">
            {userData.name}
          </h2>
          <p className="text-indigo-100 capitalize">
            {userData.role}
          </p>
        </div>

        {/* 📄 Details */}
        <div className="p-6 space-y-4 text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Email</span>
            <span className="text-gray-600">{userData.email}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Phone</span>
            <span className="text-gray-600">{userData.phone}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Role</span>
            <span className="capitalize text-black font-semibold">
              {userData.role}
            </span>
          </div>
      <Link className="bg-linear-to-r from-gray-500 px-4  p-1 rounded to-black text-white hover:bg-linear-to-r hover:from-black hover:to-gray-400" to='/owner/dashboard'>Go Back</Link>
        </div>

      </div>
    </div>
  );
};

export default OwnerProfile;
