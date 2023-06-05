'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import logIn from '@/firebase/auth/login';
import { useUserContext } from '@/context/AuthContext';


function LoginPage() {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const { user, setUser } = useUserContext();

  const router = useRouter()

  const handleForm = async (event) => {
    event.preventDefault()
    try {

      // login
      const res1 = await logIn(email, password);

      console.log("result from logIn: ", res1);
      if (!res1.error){
        setUser(res1.result)
        router.push('/profile');
      }
      
    } catch (err){
      console.log("error: ", err)
    }
}

  return (
    <div className="wrapper">
    <div className="form-wrapper">
        <h1 className="">Login</h1>
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
      {/* { user ?  JSON.stringify(user) : "no user" } */}
</div>
  )
}

export default LoginPage