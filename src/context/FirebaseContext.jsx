import React, { createContext, useContext, useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword ,signOut,onAuthStateChanged} from "firebase/auth"
import { setDoc, doc, getFirestore, getDoc ,query,where,getDocs,addDoc,updateDoc ,collection} from "firebase/firestore"
import { getStorage} from "firebase/storage";
export const FirebaseContext = createContext()

import {toast} from "react-toastify" 
import { useNavigate } from 'react-router-dom'



const firebaseConfig = {
  apiKey: "AIzaSyDsmXcT_kwa01SdhNOCIRuIMdPQsUcxzhs",
  authDomain: "room-rent-app-281d2.firebaseapp.com",
  projectId: "room-rent-app-281d2",
  storageBucket: "room-rent-app-281d2.firebasestorage.app",
  messagingSenderId: "211183994184",
  appId: "1:211183994184:web:75ec0f635982611f39df7d",
  measurementId: "G-244XP8S49H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firebaseAuth = getAuth(app)
const db = getFirestore(app)
export const useFirebase = () => useContext(FirebaseContext)
export const FirebaseContextProvider = ({ children }) => {
  let [user, setUser] = useState('')
  let [userData, setUserData] = useState(null);
  const [rent, setRent] = useState(null);
  let [loading, setLoading] = useState(true); 
  let navigate = useNavigate()
   const [showAddRoom, setShowAddRoom] = useState(false);
  useEffect(() => {
  if (firebaseAuth.currentUser) {
    fetchRent();
  }
}, [firebaseAuth.currentUser]);
  
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
    if (user) {
      setUser(user);
      const data = await getCurrentUserData(user.uid);
      setUserData(data);

    } else {
      setUser(null);
      setUserData(null);
    }

    setLoading(false);
  });

  return () => unsubscribe();
}, []);
  
  let isLoggedIn = user ? true : false;
   let signUpUser = async (email, password, role, name, phone) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const user = userCredential.user;

   
    await setDoc(doc(db, "users", user.uid), {
  email: user.email,
  name,
  phone,
  role,
  ownerId: role === "tenant" ? null : user.uid,
  assignedRoomId: null,                         
  createdAt: new Date(),
});


    toast.success("User Created & Data Saved ✅");
    navigate("/")

  } catch (error) {
    toast.error("Signup Error:", error.code, error.message);
  }
  };
  
  
    let loginWithEmailAndPassword = async(email,password) => {
    try {
        let user = await signInWithEmailAndPassword(firebaseAuth, email, password)
      toast.success("Login success✅")
      navigate("/")
        console.log(user)
    } catch (error) {
        // alert("Error")
      toast.error(error.code,error.message)
    }
    }
 const getCurrentUserData = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("No such user!");
    }
  } catch (error) {
    console.log(error);
  }
  };
  
 
const uploadProfileImage = async (file) => {
  if (!file) throw new Error("No file selected");

  const uid = firebaseAuth.currentUser.uid;

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "room_images");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/djkjbvbjh/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Cloudinary Error:", err);
    throw new Error("Cloudinary upload failed");
  }

  const result = await res.json();

  await setDoc(
    doc(db, "users", uid),
    { profileImage: result.secure_url },
    { merge: true }
  );

  return result.secure_url;
};


  
 const addRoom = async (roomData) => {
  try {
    const docRef = await addDoc(collection(db, "rooms"), roomData);
    console.log("Room Added ✅ ID:", docRef.id);
  } catch (error) {
    console.log("Add Room Firestore Error:", error.message);
    throw error;
  }
};

  let logOut = async() => {
  await signOut(firebaseAuth).then((res)=>toast.success("Log out successfully✅")).catch((err)=>toast.error("Error when log out"))
  }
  

// GET ALL TENANTS
const getTenants = async () => {
  try {
    console.log("🔥 getTenants called");

    const q = query(
      collection(db, "users"),
      where("role", "==", "tenant"),
      where("ownerId", "==", null),
    );

    const snap = await getDocs(q);

    console.log("🔥 tenant docs:", snap.docs.length);

    return snap.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.log("❌ Get Tenants Error:", error);
    return [];
  }
};


// assign room
const assignRoomToTenant = async (roomId, tenantId) => {
  const ownerId = firebaseAuth.currentUser.uid;

  // Room update
  await updateDoc(doc(db, "rooms", roomId), {
    status: "booked",
    tenantId,
    ownerId
  });

  // Tenant update
  await updateDoc(doc(db, "users", tenantId), {
    assignedRoomId: roomId,
    ownerId
  });
};


  
  
   //  FETCH RENT (FINAL)
const fetchRent = async () => {
  try {
    const uid = firebaseAuth.currentUser?.uid;
    if (!uid) return;

    // 1️⃣ Tenant
    const userSnap = await getDoc(doc(db, "users", uid));
    if (!userSnap.exists()) return;
    const userData = userSnap.data();

    const roomId = userData.assignedRoomId;
    if (!roomId) {
      setRent(null);
      return;
    }

    // 2️⃣ Room
    const roomSnap = await getDoc(doc(db, "rooms", roomId));
    if (!roomSnap.exists()) return;
    const roomData = roomSnap.data();

    const month = new Date().toLocaleString("default", { month: "long" });
    const year = new Date().getFullYear();

    // 3️⃣ 🔥 CHECK PAYMENT STATUS
    const q = query(
      collection(db, "payments"),
      where("tenantId", "==", uid),
      where("roomId", "==", roomId),
      where("month", "==", month),
      where("year", "==", year)
    );

    const paySnap = await getDocs(q);
    const isPaid = !paySnap.empty;

    const paymentData = isPaid ? paySnap.docs[0].data() : null;

    // 4️⃣ SET RENT STATE ✅
    setRent({
      roomId,
      amount: roomData.rent,
      paid: isPaid,
      paidAmount: paymentData?.amount || null,
      paymentDate: paymentData?.createdAt?.toDate?.() || null,
      month,
    });

  } catch (err) {
    toast.error("❌ fetchRent error:", err);
  }
};



  // pay rent method
const payRent = async (amount) => {
  try {
    const uid = firebaseAuth.currentUser.uid;

    const userSnap = await getDoc(doc(db, "users", uid));
    const userData = userSnap.data();

    const roomId = userData.assignedRoomId;
    const roomSnap = await getDoc(doc(db, "rooms", roomId));
    const roomData = roomSnap.data();

    const month = new Date().toLocaleString("default", { month: "long" });
    const year = new Date().getFullYear();

    // 🔒 prevent double payment
    const q = query(
      collection(db, "payments"),
      where("tenantId", "==", uid),
      where("roomId", "==", roomId),
      where("month", "==", month),
      where("year", "==", year)
    );

    const snap = await getDocs(q);
    if (!snap.empty) {
      toast.info("Rent already paid for this month");
      return;
    }

   
    await addDoc(collection(db, "payments"), {
      tenantId: uid,
      tenantName: userData.name,
      ownerId: roomData.ownerId,
      roomId,
      amount: Number(amount),
      month,
      year,
      status: "paid",
      createdAt: new Date(),
    });

    // ✅ IMPORTANT: UPDATE RENT STATE
    setRent({
      roomId,
      amount: roomData.rent,
      paid: true,
      paidAmount: amount,
      paymentDate: new Date().toISOString(),
      month,
    });

    toast.success("Rent Paid Successfully ✅");

  } catch (err) {
    console.log("❌ Pay Rent Error:", err);
    toast.error("Payment failed");
  }
};



// ✅ GET ROOMS OF CURRENT OWNER
const getRooms = async () => {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, "rooms"),
      where("ownerId", "==", user.uid)
    );

    const snap = await getDocs(q);

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.log("❌ getRooms error:", error);
    return [];
  }
};




  
  
      
    return <FirebaseContext.Provider
  value={{
    signUpUser,
    loginWithEmailAndPassword,
        isLoggedIn,
    getRooms,
    db,
    loading,
    userData,
    uploadProfileImage,
    addRoom,
    logOut,
    assignRoomToTenant,
    getTenants,
    payRent,
    fetchRent,
    rent,
    showAddRoom,
    setShowAddRoom
  }}
>

    {children}
    </FirebaseContext.Provider>
}
