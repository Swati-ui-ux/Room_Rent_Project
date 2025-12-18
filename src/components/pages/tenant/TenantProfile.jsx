import React from 'react'
import { useFirebase } from '../../../context/FirebaseContext'
import { Link } from 'react-router-dom'
const TenantProfile = () => {
    let {userData} = useFirebase()
  return (
          <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold text-center mb-4">
              Tenant Profile
            </h1>
    <p className="mb-2">
             <img src={userData.profileImage} className='rounded' alt="Tenant Profile" />
            </p>
            <p className="mb-2">
              <b>Name:</b> {userData.name}
            </p>
            <p className="mb-2">
              <b>Email:</b> {userData.email}
            </p>
            <p className="mb-2">
              <b>Phone:</b> {userData.phone}
            </p>
            <p className="mb-2">
              <b>Role:</b> {userData.role}
          </p>
          <Link className='bg-gray-400 px-6 p-1 rounded' to='/tenant/dashboard' >Go Back</Link>
          </div>
  )
}

export default TenantProfile