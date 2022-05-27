import React, { useState } from "react";
import Signin from "../pages/SignIn";
import Signup from "../pages/Signup";
import  signInLogo  from '../assets/images/logo light.svg';

const Auth = () => {
  const [index, setIndex] = useState(false);
  const toggleIndex = () => {
    setIndex((prevState) => !prevState);
  };

  return (
    <div className="flex">

      <div className="hidden sm:flex w-3/4 mainImg h-screen justify-center items-center pb-10">
        <img src={signInLogo} alt="" className="w-1/2"/>
      </div>

      <div className="w-full sm:w-1/4 sm:min-w-[400px] bg-neutral-900 h-screen p-8 text-white flex flex-col items-center justify-center">
        
        {!index ? <Signin /> : <Signup />}
        <p className="toggle" onClick={toggleIndex}>
          {!index ? "Ro`yxatdan o`tish" : "Kirish"}
        </p>
      </div>
      <div id="recaptcha"></div>
      
    </div>
  );
};

export default Auth;
