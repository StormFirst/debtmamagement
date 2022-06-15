import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../api/firebase';
import Loading from '../components/Loading';

function PhoneReg() {
    const [email, setEmail] = useState("");
    const [ pass, setPass ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate()

    const getE = (e) => {
        setEmail(e.target.value)
    }

    const getP = (e) => {
        setPass(e.target.value)
    }
    const onSubmit = async () => {
        setLoading(true)
        try {
            createUserWithEmailAndPassword(auth, email, pass);
            navigate('/')
        } catch (error) {
            
        }
        setLoading(false)
    }
    if(loading) {
        return <Loading />
    }
    
    return (
        <form className='flex flex-col w-[350px] items-center' onSubmit={onSubmit}>
            <label>
                Email:<input type="email"  className="input w-[200px] my-2 p-4 bg-slate-600" onChange={getE}/>
            </label>
            <label>
                Password:<input type="text" className="input w-[200px] my-2 p-4 bg-slate-600" onChange={getP}/>
            </label>
            <button type='submit'>Yuborish</button>
        </form>
    )
}

export default PhoneReg