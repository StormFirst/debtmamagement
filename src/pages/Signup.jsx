import React, { useRef } from "react";
import { useUserContext } from "../context/userContext";

const Signup = () => {
  const emailRef = useRef();
  const psdRef = useRef();
  const compname = useRef()
  const { registerUser } = useUserContext();

  const onSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = psdRef.current.value;
    const name = compname.current.value
    if (email && password && name) registerUser(email, password, name);
  };

  return (
    <div className="pb-10 text-center">
      <h2 className="font-medium sm:text-3xl text-center my-2 hidden sm:block">Sign up</h2>
      <form  onSubmit={onSubmit}>
        <input placeholder="Email" type="email"  className="input my-2 p-4 bg-neutral-800" ref={emailRef} />
        <input placeholder="Password" type="password" className="input my-2 p-4 bg-neutral-800" ref={psdRef} />
        <input type="text" placeholder="Kompaniya nomi yoki ismingiz" className="input my-2 p-4 bg-neutral-800" ref={compname} />
        <button type="submit" className="btn btn-primary w-full p-3 my-2">Sign up</button>
      </form>
      
    </div>
  );
};

export default Signup;
