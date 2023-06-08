"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  where,
  getDoc,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

function QuotesPage() {
  const { user, setUser } = useUserContext();
  const router = useRouter();

  let getAllQuotes = async () => {
    let quotesList = [];
    try {
      const docRef = collection(db, "quotes");
      let quotesSnapshot = await getDocs(
        query(docRef, orderBy("createdAt", "desc"))
      );
      for (let i = 0; i < quotesSnapshot.docs.length; i++) {
        let currentDoc = quotesSnapshot.docs[i];
        let newObj = { ...currentDoc.data(), id: currentDoc.id };
        quotesList.push(newObj);
      }

      // attach user data for each quote obj in quotesList
      // need user id for each quote
      for (let i = 0; i < quotesList.length; i++) {
        let current = quotesList[i];
        let currentUser = current.userId;
        let userId = currentUser.split("/")[2];

        // get user info for each quotesList obj
        const docRef = collection(db, "users");
        let userSnapshot = await getDocs(
          query(docRef, where("userId", "==", userId))
        );
        let userData = userSnapshot.docs[0].data();
        // console.log("userData: ", userData);
        //append username, image url to existing quotesList obj
        current["username"] = userData["username"];
        current["photoURL"] = userData["photoURL"];
      }

      setQuotes(quotesList);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  useEffect(() => {
    //Runs only on the first render
    setLoading(true);
    getAllQuotes();
    setLoading(false);
  }, []);

  const [loading, setLoading] = useState(true);
  const [speaker, setSpeaker] = useState("");
  const [quoteBody, setQuoteBody] = useState("");
  const [quotes, setQuotes] = useState([]);

  let handleFormSubmit = async (e) => {
    e.preventDefault();
    // user collection object: user (ref users collection), speaker, quoteBody, createAt
    // Add a new document with a generated id.
    console.log("handleForm called");
    const docRef = await addDoc(collection(db, "quotes"), {
      speaker: speaker,
      quoteBody: quoteBody,
      userId: "/users/" + user.uid,
      createdAt: serverTimestamp(),
    });
    const newQuotes = await getAllQuotes();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "4vh",
        }}
      >
        All Quotes
      </p>
      <h4
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1vh",
        }}
      >
        Add a quote
      </h4>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <form onSubmit={handleFormSubmit} className="form">
          <label
            htmlFor="speaker"
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            <p style={{ marginRight: "2vw" }}>Speaker: </p>
            <input
              onChange={(e) => setSpeaker(e.target.value)}
              type="text"
              name="speaker"
              id="speaker"
              placeholder="Monty Python"
            />
          </label>
          <label
            htmlFor="quoteBody"
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            <p style={{ marginRight: "2vw" }}>Quote: </p>
            <input
              onChange={(e) => setQuoteBody(e.target.value)}
              type="text"
              name="quoteBody"
              id="quoteBody"
              placeholder="We are the knights who..."
            />
          </label>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      {loading && <p>Loading...</p>}
      {quotes &&
        quotes.map((obj, index) => {
          return (
            <div
              key={index}
              style={{
                marginLeft: "30vw"
              }}
            >
              <div style={{ 
                marginTop: "4vh",
                marginBottom: "4vh", 
                display: "flex"
              }}>
                <div style={{ marginRight: "4vw" }}>
                  <img
                    style={{ height: "20vh" }}
                    src={obj.photoURL}
                    alt="profile image"
                  />
                </div>
                <div style={{ marginTop: "1vh" }}>
                  <p>Speaker: {obj.speaker}</p>
                  <p style={{ display: "flex", flexWrap: "wrap" }}>Quote: "{obj.quoteBody}"</p>
                  <p>Posted by: {obj.username}</p>
                  <p>Created at: {obj.createdAt.toDate().toDateString()}</p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default QuotesPage;
