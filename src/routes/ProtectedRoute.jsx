import React from "react";
import { Navigate } from "react-router-dom";
import { useFirebase } from "../context/FirebaseContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useFirebase();

  // Jab tak firebase response nahi deta
  if (loading) {
      return <h2>Loading...</h2>; 
      
  }

 
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
