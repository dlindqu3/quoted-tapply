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
  const [loading, setLoading] = useState(false);
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
    setPostedQuotes(postedQuotes);
  };

  let getUserDoc = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let existingQuote = docSnap.data()["favoriteQuote"];
      setUserQuote(existingQuote);
    } 
  };

  // FIX 
  useEffect(() => {
    setLoading(true);
    getUserDoc();
    getPostedQuotes();
    setLoading(false);
  }, []);

  // FOR SOME REASON, THIS DOESN'T WORK 
  // useEffect(() => {
  //   setLoading(true);
  //   if (user == null) {
  //     router.push("/login");
  //   } else {
  //     getUserDoc();
  //     getPostedQuotes();
  //   }
  //   setLoading(false);
  // }, [user]);

  let handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (newPhoto) {
        // add new image to storage
        let imageName = newPhoto.name;
        let randomizedName = `${v4() + imageName}`;
        const imageRef = ref(storage, `images/${randomizedName}`);
        let uploadedData = await uploadBytes(imageRef, newPhoto);
        // add new image's url as user's photoURL
        let newPhotoURL = await getDownloadURL(
          ref(storage, uploadedData.ref._location.path_)
        );
        // update user in auth
        const res = await updateProfile(auth.currentUser, {
          photoURL: newPhotoURL,
        });
  
        const userObjRef = doc(db, "users", user.uid);
        const res2 = await updateDoc(userObjRef, {
          photoURL: newPhotoURL
        })
      }
  
      if (newEmail) {
        const res = await updateProfile(auth.currentUser, {
          email: newEmail,
        });
      }
  
      if (newUsername) {
        const res = await updateProfile(auth.currentUser, {
          displayName: newUsername,
        });
      }
  
      if (newUserQuote) {
        const userObjRef = doc(db, "users", user.uid);
        const res = await updateDoc(userObjRef, {
          favoriteQuote: newUserQuote,
        });
        if (!res) {
          setUserQuote(newUserQuote);
        }
      }
    } catch (err){
      console.log(err); 
    }
    setLoading(false);
  };

  // takes a quote id as arg   
  let handleDeleteQuote = async (id) => {
    try {
      let deleted = await deleteDoc(doc(db, "quotes", id));
      getPostedQuotes(); 
    } catch (err){
      console.log("error from delete: ", err); 
    }
  }

  // takes a quote id as arg   
  let handleUpdateQuote = (id) => {
    const dialog = document.getElementById("dialog");
    dialog.showModal();
    setIdForUpdate(id); 
  }

  let handleDialogSubmit = async (e) => {
    e.preventDefault(); 
    // update current item in db
    const quoteRef = doc(db, "quotes", idForUpdate);
 
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
              placeholder="We are the knights who..."
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
          setIdForUpdate(null); 
          const dialog = document.getElementById("dialog");
          dialog.close();
        }}>Cancel</button>
      </dialog>
    </div>
  );
}

export default ProfilePage;
