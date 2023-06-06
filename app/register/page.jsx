'use client';
import React from "react";
import signUp from "@/firebase/auth/signup";
import { auth, storage } from "@/firebase/config";
import { updateProfile } from "firebase/auth";
import { useRouter } from 'next/navigation';
import {  ref, getDownloadURL } from "firebase/storage";
import { db } from "@/firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// By default, each page you add in the app directory is a Server component 
// which means we cannot add client-side interactivity like adding an onSubmit() 
// to a form element. To add this client-side interactivity we tell Next.js 
// that we want a Client component by adding 'use client' at the top of 
// the file before any imports

function RegisterPage() {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')

  const router = useRouter();

  const handleForm = async (event) => {
    event.preventDefault()
    try {

      // NOTE: 
      // by default, the uid associated with an auth user is not the same as the id associated with a user collection object

      // create user (auth)
      const res1 = await signUp(email, password);

      // update user (auth)
      let defaultImageURL = await getDownloadURL(ref(storage, 'images/default-profile-image.jpg')); 
      const res3 = await updateProfile(auth.currentUser, {
        displayName: username, photoURL: defaultImageURL
      })

      // create/add to user collection
      const res2 = await setDoc(doc(db, "users", res1.result.user.uid), {
        favoriteQuote: "",
        userId: res1.result.user.uid,
        photoURL: defaultImageURL,
        username: username,
        timestamp: serverTimestamp()
      }); 

      // check new user data in auth 
      const user = auth.currentUser;
      console.log("user in auth after collection doc added: ", user); 

      router.push('/login');
      
    } catch (err){
      console.log("error: ", err)
    }
}

  return (
    <div className="wrapper">
        <div className="form-wrapper">
            <h1 className="">Register</h1>
            <form onSubmit={handleForm} className="form">
                <label htmlFor="email">
                    <p>Email: </p>
                    <input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" />
                </label>
                <label htmlFor="username">
                    <p>Username: </p>
                    <input onChange={(e) => setUsername(e.target.value)} required type="text" name="username" id="username" placeholder="Jerry55" />
                </label>
                <label htmlFor="password">
                    <p>Password:</p>
                    <input onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="password" />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    </div>
  )
}

export default RegisterPage