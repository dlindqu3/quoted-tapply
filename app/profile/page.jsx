"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  collection,
} from "firebase/firestore";
import { db, storage, auth } from "@/firebase/config";
import { getAuth, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

function ProfilePage() {
  const { user, setUser } = useUserContext();
  const router = useRouter();

  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [userQuote, setUserQuote] = useState("");
  const [newUserQuote, setNewUserQuote] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postedQuotes, setPostedQuotes] = useState([]);
  const [idForUpdate, setIdForUpdate] = useState(null); 
  const [newSpeaker, setNewSpeaker] = useState(null); 
  const [newBody, setNewBody] = useState(null); 


  let getPostedQuotes = async () => {
    let userId = "/users/" + user.uid;
    const docRef = collection(db, "quotes");
    let postedQuotesSnapshot = await getDocs(
      query(docRef, where("userId", "==", userId))
    );
    let postedQuotes = [];
    for (let i = 0; i < postedQuotesSnapshot.docs.length; i++) {
      let current = postedQuotesSnapshot.docs[i];
      let obj = { ...current.data(), id: current.id };
      postedQuotes.push(obj);
    }
    // console.log("user's posted quotes: ", postedQuotes);
    setPostedQuotes(postedQuotes);
  };

  let getUserDoc = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      let existingQuote = docSnap.data()["favoriteQuote"];
      // console.log("existingQuote: ", existingQuote);
      setUserQuote(existingQuote);
    } 
  };

  // HERE: get user's favorite quote from collection, add in state, display
  useEffect(() => {
    if (user == null) {
      router.push("/login");
    } else {
      getUserDoc();
      getPostedQuotes();
      setLoading(false);
    }
  }, []);

  let handleForm = async (e) => {
    e.preventDefault();
    // console.log("handleForm called");
    setLoading(true);
    if (newPhoto) {
      // add new image to storage
      let imageName = newPhoto.name;
      let randomizedName = `${imageName + v4()}`;
      const imageRef = ref(storage, `images/${randomizedName}`);
      let uploadedData = await uploadBytes(imageRef, newPhoto);
      // console.log("uploaded image data: ", uploadedData);
      // add new image's url as user's photoURL
      let newPhotoURL = await getDownloadURL(
        ref(storage, uploadedData.ref._location.path_)
      );
      // console.log("new photoURL: ", newPhotoURL);
      // update user in auth
      const res = await updateProfile(auth.currentUser, {
        photoURL: newPhotoURL,
      });
    }

    if (newEmail) {
      // console.log("email is new");
      const res = await updateProfile(auth.currentUser, {
        email: newEmail,
      });
    }

    if (newUsername) {
      // console.log("username is new");
      const res = await updateProfile(auth.currentUser, {
        displayName: newUsername,
      });
    }

    if (newUserQuote) {
      // console.log("quote is new");
      const userObjRef = doc(db, "users", user.uid);
      // console.log("userObjRef: ", userObjRef);
      const res = await updateDoc(userObjRef, {
        favoriteQuote: newUserQuote,
      });
      // console.log("res from update quote: ", res);
      if (!res) {
        setUserQuote(newUserQuote);
      }
    }
    setLoading(false);
  };

  // takes a quote id as arg   
  let handleDeleteQuote = async (id) => {
    try {
      let deleted = await deleteDoc(doc(db, "quotes", id));
      // console.log("quote deleted"); 
      getPostedQuotes(); 
    } catch (err){
      console.log("error from delete: ", err); 
    }
  }

  // takes a quote id as arg   
  let handleUpdateQuote = (id) => {
    const dialog = document.getElementById("dialog");
    dialog.showModal();
    // console.log("handleUpdateQuote called"); 
    // console.log("id passed to update: ", id); 
    setIdForUpdate(id); 
  }

  let handleDialogSubmit = async (e) => {
    e.preventDefault(); 
    // console.log("handleDialogSubmit called"); 
    // console.log("newBody: ", newBody);
    // console.log("newSpeaker: ", newSpeaker); 
    // console.log("id from dialog: ", idForUpdate); 

    // update current item in db
    const quoteRef = doc(db, "quotes", idForUpdate);
    // console.log("quoteRef from update: ", quoteRef); 

    if (newBody && newSpeaker){
      await updateDoc(quoteRef, {
        quoteBody: newBody,
        speaker: newSpeaker
      });
    } else if (newBody){
      await updateDoc(quoteRef, {
        quoteBody: newBody
      });
    } else if (newSpeaker){
      await updateDoc(quoteRef, {
        speaker: newSpeaker
      });
    }

    // update postedQuotes state 
    getPostedQuotes(); 

    setIdForUpdate(null);
    const dialog = document.getElementById("dialog");
    dialog.close();
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h4>Profile Data</h4>
      <div>Username:</div>
      <p>{user && user.displayName}</p>
      <div>Email:</div>
      <p>{user && user.email}</p>
      <button
        onClick={() => {
          openUserDialog();
        }}
      >
        Update User Info
      </button>
      <br />
      <div>Favorite quote: </div>
      {userQuote.length > 0 ? <p>{userQuote}</p> : <p>None</p>}
      <div className="w-1/6 relative bg-slate-300">
        <img
          className="w-full h-full object-cover"
          src={user && user.photoURL}
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
            <input
              onChange={(e) => setNewEmail(e.target.value)}
              type="email"
              name="new-email"
              id="new-email"
              placeholder="example@mail.com"
            />
          </label>
          <label htmlFor="username">
            <p>New username:</p>
            <input
              onChange={(e) => setNewUsername(e.target.value)}
              type="text"
              name="new-username"
              id="new-username"
              placeholder="example55"
            />
          </label>
          <label htmlFor="new-user-quote">
            <p>New favorite quote:</p>
            <input
              onChange={(e) => setNewUserQuote(e.target.value)}
              type="text"
              name="new-user-quote"
              id="new-user-quote"
              placeholder="We are the knights who say 'Ni'"
            />
          </label>
          <label htmlFor="new-photo">
            <p>New profile image:</p>
            <input
              onChange={(e) => setNewPhoto(e.target.files[0])}
              type="file"
              name="new-photo"
              id="new-photo"
            />
          </label>
          <button type="submit">Submit</button>
        </form>

        <br />
        {loading && <p>Loading...</p>}
        <br />

        {postedQuotes &&
          postedQuotes.map((obj, index) => {
            return (
              <div key={index}>
                <p>quote id: {obj.id}</p>
                <p>speaker: {obj.speaker}</p>
                <p>body: {obj.quoteBody}</p>
                <p>created at: {obj.createdAt["seconds"]}</p>
                <div>
                  <button
                    onClick={() => {
                      handleUpdateQuote(obj.id);
                    }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteQuote(obj.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
                <br />
              </div>
            );
          })}

        {newUsername && <p>new username: {newUsername}</p>}
        {newEmail && <p>new email: {newEmail}</p>}
        {newUserQuote && <p>new quote: {newUserQuote}</p>}
        {newPhoto && <p>new photo url: {JSON.stringify(newPhoto)}</p>}
      </div>
      
      <dialog id="dialog">
        <p>AAAAGGSFGSFG</p>
        <form onSubmit={handleDialogSubmit} className="form">
            <label htmlFor="newSpeaker">
                <p>Update speaker: </p>
                <input onChange={(e) => setNewSpeaker(e.target.value)} type="text" name="newSpeaker" id="newSpeaker" placeholder="Monty Python" />
            </label>
            <label htmlFor="newBody">
                <p>Update quote: </p>
                <input onChange={(e) => setNewBody(e.target.value)} type="text" name="newBody" id="newBody" placeholder="We are the knights who say 'Ni'" />
            </label>
            <button type="submit">Submit</button>
        </form>
        <button onClick={() => {
          // console.log("id from dialog: ", idForUpdate); 
          setIdForUpdate(null); 
          const dialog = document.getElementById("dialog");
          dialog.close();
        }}>Cancel</button>
      </dialog>
    </div>
  );
}

export default ProfilePage;
