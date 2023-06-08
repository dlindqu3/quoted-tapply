"use client";
import React from "react";
import { useRouter } from "next/navigation";
import logIn from "@/firebase/auth/login";
import { useUserContext } from "@/context/AuthContext";

function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { user, setUser } = useUserContext();

  const router = useRouter();

  const handleForm = async (event) => {
    event.preventDefault();
    try {
      // login
      const res1 = await logIn(email, password);

      // console.log("result from logIn: ", res1);
      if (!res1.error) {
        // console.log("user from login: ", res1.result.user);
        setUser(res1.result.user);
        router.push("/");
      }
    } catch (err) {
      console.log("error: ", err);
    }
  };

  return (
    <div style={{ margin: "auto" }}>
      <div style={{ marginBottom: "45vh" }}>
        <h1 style={{ marginLeft: "6vw", marginBottom: "1vh" }}>Login</h1>
        <form onSubmit={handleForm} className="form">
          <label htmlFor="email" style={{ display: "flex",flexWrap: "wrap" }}>
            <p style={{ marginRight: "2vw" }}>Email: </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
            />
          </label>
          <label htmlFor="password" style={{ display: "flex",flexWrap: "wrap" }}>
            <p style={{ marginRight: "2vw" }}>Password:</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
            />
          </label>
          <div style={{ marginLeft: "6vw", marginTop: "1vh" }}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
