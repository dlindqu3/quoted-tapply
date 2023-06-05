'use client';
import React from "react";
import signUp from "@/firebase/auth/signup";
import { auth, storage } from "@/firebase/config";
import { updateProfile } from "firebase/auth";
import { useRouter } from 'next/navigation';
import {  ref, getDownloadURL } from "firebase/storage";
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// By default, each page you add in the app directory is a Server component 
// which means we cannot add client-side interactivity like adding an onSubmit() 
// to a form element. To add this client-side interactivity we tell Next.js 
// that we want a Client component by adding 'use client' at the top of 
// the file before any imports

function RegisterPage() {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')

  const router = useRouter()

  const handleForm = async (event) => {
    event.preventDefault()
    try {

      // create user (auth)
      const res1 = await signUp(email, password);
      console.log("result from register: ", res1);

      // create/add to user collection
      const res2 = await addDoc(collection(db, "users"), {
        username: username, 
        email: email, 
        password: password,
        timestamp: serverTimestamp()
      }); 
      console.log("res2 from user collection/creation: ", res2);
      console.log("res2.id from user collection/creation: ", res2.id);

      // get default image from firebase storage 
      let defaultImageURL = await getDownloadURL(ref(storage, 'images/default-profile-image.jpg')); 
      console.log("defaultImageURL: ", defaultImageURL); 

      // updated created user: add username, photoURL 
      console.log("auth.currentUser after register: ");
      console.log(auth.currentUser);  
      const res3 = await updateProfile(auth.currentUser, {
        displayName: username, photoURL: defaultImageURL
      })
      // console.log("res3: ", res3); ## this is void normally 

      // check new user data in auth 
      const user = auth.currentUser;
      console.log("user in auth after username and default image url added: ", user); 

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