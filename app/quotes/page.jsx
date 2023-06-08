'use client';
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext'
import { db } from "@/firebase/config";
import { collection, getDocs, where, getDoc, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore"; 
import { useRouter } from 'next/navigation';

function QuotesPage() {

  const { user, setUser } = useUserContext();
  const router = useRouter();

  let getAllQuotes = async () => {
    let quotesList = [];
    try {
      const docRef = collection(db, 'quotes');    
      let quotesSnapshot = await getDocs(query(docRef, orderBy("createdAt", "desc")));
      for (let i = 0; i < quotesSnapshot.docs.length; i++){
        let currentDoc = quotesSnapshot.docs[i]; 
        let newObj = { ...currentDoc.data(), id: currentDoc.id }; 
        quotesList.push(newObj); 
      }       

      // attach user data for each quote obj in quotesList
      // need user id for each quote 
      for (let i = 0; i < quotesList.length; i++){
        let current = quotesList[i]; 
        let currentUser = current.userId;
        let userId = currentUser.split("/")[2]; 

        // get user info for each quotesList obj
        const docRef = collection(db, 'users');    
        let userSnapshot = await getDocs(query(docRef, where("userId", "==", userId)));
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
  }

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
      createdAt: serverTimestamp()
    });     
    const newQuotes = await getAllQuotes(); 
  } 

  if (loading){
    return <p>Loading...</p>
  } 

  return (
    <div>
      <div>Quotes page here </div>
      <h4>Add a quote</h4>
          <form onSubmit={handleFormSubmit} className="form">
            <label htmlFor="speaker">
                <p>Speaker: </p>
                <input onChange={(e) => setSpeaker(e.target.value)} type="text" name="speaker" id="speaker" placeholder="Monty Python" />
            </label>
            <label htmlFor="quoteBody">
                <p>Quote: </p>
                <input onChange={(e) => setQuoteBody(e.target.value)} type="text" name="quoteBody" id="quoteBody" placeholder="We are the knights who..." />
            </label>
            <button type="submit">Submit</button>
        </form>

        <br /> 
        { loading && <p>Loading...</p> }
        <br />
        <br /> 
        {
          quotes && quotes.map((obj, index) => {
            return <div key={index}>
                    <p>quote id: {obj.id}</p>
                    <p>username: {obj.username}</p>
                    <div className="w-1/6 relative bg-slate-300">
                      <img 
                        className="w-full h-full object-cover" 
                        src={ obj.photoURL } 
                        alt="profile image"
                      />
                    </div>
                    <p>speaker: {obj.speaker}</p>
                    <p>body: {obj.quoteBody}</p>
                    <p>created at: {obj.createdAt["seconds"]}</p>
                    <br />
                  </div>
          })
        }
    </div>
  )
}

export default QuotesPage