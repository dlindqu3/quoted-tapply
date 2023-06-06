'use client';
import React from "react"; 
// import { useUserContext } from '@/context/AuthContext';
// import { auth } from "@/firebase/config";

export default function Home() {

  // const { user, setUser } = useUserContext();

  // useEffect(() => {
  //   //Runs only on the first render
  //   // check initial auth state 
  //   if (user){
  //     console.log("there is already a user"); 
  //   } else {
  //     console.log("there is not a user yet"); 
  //   }

  //   // console.log("useEffect from main page.js called"); 
  //   // let userData = localStorage.getItem("quoted-user");
  //   // // console.log("main page.js userData from useEffect: ", userData); 
  //   // let userObj = JSON.parse(userData); 
  //   // console.log("userObj.user.email from localStorage: ", userObj.user.email); 
  //   // setUser(userObj);
  // }, []);

  return (
    // <main className="min-h-screen">
    <main className="">
      <p>Homepage Here</p>
      <p>Add directions to signup or login to view quotes</p>
      <p>Add screenshots of profile, quotes pages</p>
      {/* { user && <p>user: { user.displayName }</p> } */}
    </main>
  )
}
