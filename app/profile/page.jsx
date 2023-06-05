'use client';
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, collection, storage, auth } from '@/firebase/config';
import { getAuth, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

function ProfilePage() {

  const { user, setUser } = useUserContext();
  const [newUsername, setNewUsername] = useState(""); 
  const [newEmail, setNewEmail] = useState(""); 
  const [userQuote, setUserQuote] = useState(""); 
  const [newUserQuote, setNewUserQuote] = useState(""); 
  const [newPhoto, setNewPhoto] = useState(null); 

    // HERE: get user's fav quote from collection, add in state, display
    useEffect(() => {
      let getUserDoc = async () => {
        const docRef = doc(db, "users", user.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          let existingQuote = docSnap.data()["favoriteQuote"]; 
          // console.log("existingQuote: ", existingQuote); 
          setUserQuote(existingQuote);
        } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        }
      }
      getUserDoc();
    }, []);

    let handleForm = async (e) => {
      e.preventDefault(); 
      console.log("handleForm called"); 
      if (newPhoto){
        // add new image to storage 
        let imageName = newPhoto.name; 
        let randomizedName = `${imageName + v4()}`; 
        const imageRef = ref(storage, `images/${randomizedName}`); 
        let uploadedData = await uploadBytes(imageRef, newPhoto); 
        console.log("uploaded image data: ", uploadedData); 
        // add new image's url as user's photoURL 
        let newPhotoURL = await getDownloadURL(ref(storage, uploadedData.ref._location.path_)); 
        console.log("new photoURL: ", newPhotoURL);
        // update user in auth 
        const res = await updateProfile(auth.currentUser, {
          photoURL: newPhotoURL
        })
      }

      if (newEmail){
        console.log("email is new"); 
        const res = await updateProfile(auth.currentUser, {
          email: newEmail
        })
      }

      if (newUsername){
        console.log("username is new"); 
        const res = await updateProfile(auth.currentUser, {
          displayName: newUsername
        })
      }

      if (newUserQuote){
        console.log("quote is new"); 
        const userObjRef = doc(db, "users", user.user.uid);
        // console.log("userObjRef: ", userObjRef);     
        const res = await updateDoc(userObjRef, {
          favoriteQuote: newUserQuote
        })
      } 
    }


  return (
    <div>
        <h4>Profile Data</h4>
        { console.log("user from ProfilePage: ", user) }
        {/* { console.log("user.user from ProfilePage: ", user.user)} */}
        <div>Username:</div>
        <p>{user.user.displayName}</p>
        <div>Email:</div>
        <p>{user.user.email}</p>
        <button onClick={() => {openUserDialog()}}>Update User Info</button>
        <br /> 
        <div>Favorite quote: </div>
        { userQuote.length > 0 ? <p>{userQuote}</p> : <p>None</p> }
        <div className="w-1/6 relative bg-slate-300">
          <img 
            className="w-full h-full object-cover" 
            src={user.user.photoURL} 
            alt="profile image"
          />
        </div>
        <br /> 
        <br /> 
        <div>
          <h4>Update Profile Data</h4>
          <form onSubmit={handleForm} className="form">
            <label htmlFor="email">
                <p>New email: </p>
                <input onChange={(e) => setNewEmail(e.target.value)} type="email" name="new-email" id="new-email" placeholder="example@mail.com" />
            </label>
            <label htmlFor="username">
                <p>New username:</p>
                <input onChange={(e) => setNewUsername(e.target.value)} type="text" name="new-username" id="new-username" placeholder="example55" />
            </label>
            <label htmlFor="new-user-quote">
                <p>New favorite quote:</p>
                <input onChange={(e) => setNewUserQuote(e.target.value)} type="text" name="new-user-quote" id="new-user-quote" placeholder="We are the knights who say 'Ni'" />
            </label>
            <label htmlFor="new-photo">
                <p>New profile image:</p>
                <input onChange={(e) => setNewPhoto(e.target.files[0])} type="file" name="new-photo" id="new-photo" />
            </label>
            <button type="submit">Submit</button>
        </form>

        <br /> 
        <br />

        { newUsername && <p>new username: {newUsername}</p> }
        { newEmail && <p>new email: {newEmail}</p> }
        { newUserQuote && <p>new quote: {newUserQuote}</p> }
        { newPhoto && <p>new photo url: {JSON.stringify(newPhoto)}</p> }
      
        </div>
    </div>
  )
}

export default ProfilePage