import React,{ useState } from "react";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFirebase } from "../../context/FirebaseContext"
let Login=()=> {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const firebase = useFirebase()
  console.log(firebase)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()
    firebase.loginWithEmailAndPassword(email, password)
    console.log(email,password)
    
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 w-80 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
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

        <button
          className="bg-black text-white w-full p-2"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
              </button>
               <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
export default React.memo(Login)