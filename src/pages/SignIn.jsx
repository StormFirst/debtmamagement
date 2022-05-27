// react imports
import { useRef, useState } from "react";
// images
import  signInLogo  from '../assets/images/logo light.svg';
// css 
import '../styles/SignIn.css';
import GoogleButton from "react-google-button";
import { useUserContext } from "../context/userContext"
import SigninPhone from "./SigninPhone";

const SignIn = () => {
  const emailRef = useRef();
  const psdRef = useRef();
  const [ open, setOpen ] = useState(false)

  const { signInUser, googleSignIn } = useUserContext();
  const onSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = psdRef.current.value;
    if (email && password) signInUser(email, password);
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <div className="pb-10 text-center">
      <img src={signInLogo} alt="" className="block sm:hidden w-1/2 mx-auto mb-4"/>
      <h2 className="font-medium sm:text-3xl text-center my-2 hidden sm:block">Login in</h2>
      <form className=""  onSubmit={onSubmit} style={{display: !open ? "block" : "none"}}>
        <input placeholder="Email" type="email"  className="input my-2 p-4 bg-neutral-800" ref={emailRef} />
        <input placeholder="Password" type="password" className="input my-2 p-4 bg-neutral-800" ref={psdRef} />
        <button type="submit" className="btn btn-primary w-full p-3 my-2">Login in</button>
      </form>
      <button className="btn btn-primary w-full p-3 my-2" onClick={()=> setOpen(true)} style={{display: !open ? "block" : "none"}}>Phone number</button>
      <div style={{display: open ? "block" : "none"}}>
        <SigninPhone open={setOpen}/>
      </div>
      <GoogleButton
        className="g-btn"
        type="dark"
        onClick={handleGoogleSignIn}
        style={{width: "100%", display: !open ? "block" : "none"}}
      />

    </div>
  );
};

export default SignIn;