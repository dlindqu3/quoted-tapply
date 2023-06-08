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
    signOut(auth).then(() => {
    router.push('/');
    }).catch((error) => {
      console.log("error signing out: ", error); 
    });
  }

  return (
    <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: "space-between", paddingLeft: "4vw", paddingRight: "4vw", minHeight: "6vh", backgroundColor: "#232f3e" }}>
      <a href="/" style={{ display: "inline-block", marginTop: "1vh", color: "white" }}>Quoted</a>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        { !user && <a href="/register" style={{ display: "inline-block", marginRight: "4vw",  textAlign: "center", marginTop: "1vh", color: "white" }}>Register</a> }
        { !user && <a href="/login" style={{ display: "inline-block", marginRight: "4vw",  textAlign: "center", marginTop: "1vh", color: "white" }}>Login</a> }
        { user && <a href="/profile" style={{ display: "inline-block", marginRight: "4vw",  textAlign: "center", marginTop: "1vh", color: "white" }}>Profile</a> }
        { user && <a href="/quotes" style={{ display: "inline-block", marginRight: "4vw",  textAlign: "center", marginTop: "1vh", color: "white" }}>Quotes</a> }
        { user && <p style={{ display: "inline-block", marginRight: "4vw", marginTop: "1vh", color: "white" }}>User: {user.displayName}</p> } 
        { user && <div><button onClick={handleLogout} style={{ display: "inline-block",  textAlign: "center", marginTop: "1vh", color: "white" }}>Logout</button></div> }
      </div>
    </nav>

  )
}

export default Header