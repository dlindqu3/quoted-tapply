'use client';
import React from 'react'
import { useUserContext } from '@/context/AuthContext';


function ProfilePage() {

    const { user, setUser } = useUserContext();
  return (
    <div>
        <p>Profile page here</p>
        { console.log("user from ProfilePage: ", user)}
        {/* { console.log("user.user from ProfilePage: ", user.user)} */}
        <div>Username:</div>
        <p>{user.user.displayName}</p>
        <div>Email:</div>
        <p>{user.user.email}</p>
        <div className="w-1/6 relative bg-slate-300">
          <img 
            className="w-full h-full object-cover" 
            src={user.user.photoURL} 
            alt="profile image"
          />
        </div>
    </div>
  )
}

export default ProfilePage