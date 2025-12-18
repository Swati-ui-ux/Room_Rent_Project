import { useState } from "react";

import {  Link } from "react-router-dom";
import { useFirebase } from "../../context/FirebaseContext"

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("owner");
  const [phone, setPhone] = useState("");
  let firebase = useFirebase();
  // console.log(firebase)
  


  let handleSignup = (e) => {
    e.preventDefault();
    console.log("Hello")
    firebase.signUpUser(email,password,role,name,phone)
  
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-6 w-80 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Signup</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
              />
              
        <input
  className="w-full border p-2 mb-3"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="w-full border p-2 mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="owner">Owner</option>
          <option value="tenant">Tenant</option>
        </select>

        <button className="bg-black text-white w-full p-2 mb-3">
          Create Account
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
