'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import logIn from '@/firebase/auth/login';

function LoginPage() {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const router = useRouter()

  const handleForm = async (event) => {
    event.preventDefault()
    try {

      // create user
      const res1 = await logIn(email, password);

      console.log("result from logIN: ", res1);

      router.push('/');
      
    } catch (err){
      console.log("error: ", err)
    }
}

  return (
    <div className="wrapper">
    <div className="form-wrapper">
        <h1 className="mt-60 mb-30">Login</h1>
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

export default LoginPage