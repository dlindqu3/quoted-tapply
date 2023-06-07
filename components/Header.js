'use client'
import React from 'react';
import { useUserContext } from '@/context/AuthContext';
import { signOut } from "firebase/auth";
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';

function Header() {

  const { user } = useUserContext();
  const router = useRouter(); 

  let handleLogout = async () => {
    console.log("handleLogout called"); 
    signOut(auth).then(() => {
      console.log("signed out"); 
      router.push('/login');
    }).catch((error) => {
      console.log("error signing out: ", error); 
    });
  }

  let handleRegister = () => {
    router.push('/register');
  }

  let handleLogin = () => {
    router.push('/login');
  }

  let handleProfile = () => {
    router.push('/profile');
  }

  let handleQuotes = () => {
    router.push('/quotes');
  }

  return (
    <div>
    <div>Header here</div>
    { !user && <button onClick={handleRegister}>Register</button> }
    { !user && <button onClick={handleLogin}>Login</button> }
    { user && <p>{user.displayName}</p> } 
    { user && <button onClick={handleProfile}>Profile</button> }
    { user && <button onClick={handleQuotes}>Quotes</button> }
    { user && <button onClick={handleLogout}>Logout</button> }
    </div>

  )
}

export default Header