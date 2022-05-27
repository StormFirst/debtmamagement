import React, { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useUserContext } from "../context/userContext"

function SigninPhone({open}) {
    const [error, setError] = useState("");
    const [number, setNumber] = useState("");
    const [ flag, setFlag ] = useState(false)
    const [otp, setOtp] = useState("");
    const [result, setResult] = useState("");

    const { setUpRecaptha,  } = useUserContext();

    const getOtp = async (e) => {
        e.preventDefault();
        
        if (number === "" || number === undefined)
          return setError("Please enter a valid phone number!");
        try {
          const response = await setUpRecaptha(number);
          setResult(response);
          setFlag(true)
        } catch (err) {

        }
    };


    const verifyOtp = async (e) => {
        e.preventDefault();
        if (otp === "" || otp === null) return;
        try {
          await result.confirm(otp);
            
        } catch (err) {

        }
    };

    return (
        <div className='signinPhone'>
            {error && <div variant="danger">{error}</div>}
            <form onSubmit={getOtp} style={{display: !flag ? "block" : "none",}}>
                <PhoneInput
                    defaultCountry="UZ"
                    value={number}
                    onChange={setNumber}
                    placeholder="Enter Phone Number"
                    
                />
                <div id="recaptcha-container"></div>

                <button type='submit' className="btn btn-primary w-full p-3 my-2">Send</button>
                <button variant="secondary" className="btn btn-danger w-full p-3 my-2" onClick={()=> open(false)}>Cancel</button>
            </form>

            <form onSubmit={verifyOtp} style={{display: flag ? "block" : "none"}}>
                <input type="otp" className="input my-2 p-4 bg-neutral-800" onChange={(e) => setOtp(e.target.value)}/>
                
                <button variant="secondary" className="btn btn-danger w-full p-3 my-2" onClick={()=> open(false)}>Cancel</button>
                
                <button type='submit' className="btn btn-primary w-full p-3 my-2">Confirm</button>
            </form>
        </div>
    )
}

export default SigninPhone