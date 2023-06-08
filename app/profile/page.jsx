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
  const [userQuote, setUserQuote] = useState(null);
  const [newUserQuote, setNewUserQuote] = useState(null); // FIX 
  const [newPhoto, setNewPhoto] = useState(null); // FIX 
  const [loading, setLoading] = useState(false);
  const [postedQuotes, setPostedQuotes] = useState([]);
  const [idForUpdate, setIdForUpdate] = useState(null);
  const [newSpeaker, setNewSpeaker] = useState(null);
  const [newBody, setNewBody] = useState(null);

  let getPostedQuotes = async () => {
    if (!user){
      return; 
    }
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
    if (!user){
      return; 
    }
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
  }, [user]);

  let handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("handleForm called to update profile data"); 
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
        // update user collection 
        const userObjRef = doc(db, "users", user.uid);
        const res2 = await updateDoc(userObjRef, {
          photoURL: newPhotoURL,
        });
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
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // takes a quote id as arg
  let handleDeleteQuote = async (id) => {
    try {
      let deleted = await deleteDoc(doc(db, "quotes", id));
      getPostedQuotes();
    } catch (err) {
      console.log("error from delete: ", err);
    }
  };

  // takes a quote id as arg
  let handleUpdateQuote = (id) => {
    const dialog = document.getElementById("dialog");
    dialog.showModal();
    setIdForUpdate(id);
  };

  let handleDialogSubmit = async (e) => {
    e.preventDefault();
    // update current item in db
    const quoteRef = doc(db, "quotes", idForUpdate);

    if (newBody && newSpeaker) {
      await updateDoc(quoteRef, {
        quoteBody: newBody,
        speaker: newSpeaker,
      });
    } else if (newBody) {
      await updateDoc(quoteRef, {
        quoteBody: newBody,
      });
    } else if (newSpeaker) {
      await updateDoc(quoteRef, {
        speaker: newSpeaker,
      });
    }

    // update postedQuotes state
    getPostedQuotes();

    setIdForUpdate(null);
    const dialog = document.getElementById("dialog");
    dialog.close();
  };

  if (!user || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ marginLeft: "4vw", marginRight: "4vw" }}>
      <p
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1vh",
        }}
      >
        Profile Data
      </p>
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "2vw" }}>
            <img
              style={{ height: "20vh" }}
              src={user && user.photoURL}
              alt="profile image"
            />
          </div>
          <div style={{ marginTop: "2vh" }}>
            <div style={{ marginRight: "2vw" }}>
              Username: {user ? user.displayName : ""}
            </div>
            <div style={{ marginRight: "2vw" }}>
              Email: {user ? user.email : ""}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "6vh" }}>
        <p style={{ marginBottom: "1vh" }}>Update profile data: </p>
        <form onSubmit={handleForm} className="form" style={{}}>
          <label htmlFor="email" style={{ display: "flex" }}>
            <p style={{ marginRight: "2vw" }}>New email: </p>
            <input
              onChange={(e) => setNewEmail(e.target.value)}
              type="email"
              name="new-email"
              id="new-email"
              placeholder="example@mail.com"
            />
          </label>
          <label htmlFor="username" style={{ display: "flex" }}>
            <p style={{ marginRight: "2vw" }}>New username:</p>
            <input
              onChange={(e) => setNewUsername(e.target.value)}
              type="text"
              name="new-username"
              id="new-username"
              placeholder="example55"
            />
          </label>
          <label htmlFor="new-photo" style={{ display: "flex" }}>
            <p style={{ marginRight: "2vw" }}>New profile image:</p>
            <input
              onChange={(e) => setNewPhoto(e.target.files[0])}
              type="file"
              name="new-photo"
              id="new-photo"
            />
          </label>
          <button type="submit">Submit</button>
        </form>

        {loading && <p>Loading...</p>}

        <div style={{ marginTop: "6vh" }}>
          {/* {postedQuotes && (
            <p style={{ marginBottom: "1vh" }}>Your posted quotes:</p>
          )} */}
          { postedQuotes &&
            postedQuotes.map((obj, index) => {
              return (
                <div key={index}>
                  <p>Speaker: {obj.speaker}</p>
                  <p>Body: {obj.quoteBody}</p>
                  <p>Created at: {obj.createdAt.toDate().toDateString()}</p>
                  <div>
                    <button
                      onClick={() => {
                        handleUpdateQuote(obj.id);
                      }}
                      style={{ marginRight: "2vw" }}
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
        </div>
      </div>

      <dialog id="dialog">
        <form onSubmit={handleDialogSubmit} className="form">
          <p style={{ display: "flex", justifyContent: "center" }}>Update quote</p>
          <label htmlFor="newSpeaker" style={{ display: "flex" }}>
            <p style={{ marginRight: "2vw" }}>Update speaker: </p>
            <input
              onChange={(e) => setNewSpeaker(e.target.value)}
              type="text"
              name="newSpeaker"
              id="newSpeaker"
              placeholder="Monty Python"
            />
          </label>
          <label htmlFor="newBody" style={{ display: "flex" }}>
            <p style={{ marginRight: "2vw" }}>Update quote: </p>
            <input
              onChange={(e) => setNewBody(e.target.value)}
              type="text"
              name="newBody"
              id="newBody"
              placeholder="We are the knights who say 'Ni'"
            />
          </label>
          <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="submit" style={{ marginRight: "2vw" }}>Submit</button>
          <button
          onClick={() => {
            setIdForUpdate(null);
            const dialog = document.getElementById("dialog");
            dialog.close();
          }}
        >
          Cancel
        </button>
        </div>
        </form>
      </dialog>
    </div>
  );
}

export default ProfilePage;
