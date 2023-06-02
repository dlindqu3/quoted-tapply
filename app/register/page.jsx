'use client';
import React from "react";
import signUp from "@/firebase/auth/signup";
import { useRouter } from 'next/navigation';


// By default, each page you add in the app directory is a Server component 
// which means we cannot add client-side interactivity like adding an onSubmit() 
// to a form element. To add this client-side interactivity we tell Next.js 
// that we want a Client component by adding 'use client' at the top of 
// the file before any imports

function RegisterPage() {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const router = useRouter()

  const handleForm = async (event) => {
    event.preventDefault()
    try {

      // create user
      const res1 = await signUp(email, password);

      console.log("result from register: ", res1);

      router.push('/login');
      
    } catch (err){
      console.log("error: ", err)
    }
}

  return (
    <div className="wrapper">
        <div className="form-wrapper">
            <h1 className="mt-60 mb-30">Register</h1>
            <form onSubmit={handleForm} className="form">
                <label htmlFor="email">
                    <p>Email: </p>
                    <input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" />
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