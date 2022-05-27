import { useState } from "react";
import Loading from "../components/Loading"
// firebase
import { db } from '../api/firebase';
import { collection, addDoc } from "firebase/firestore";
import "../styles/Main.css"
import { auth } from "../api/firebase";

function AddLoan() {
    const [ name, setName ] = useState("")
    const [ number, setNumber ] = useState("")
    const [ loan, setLoan] = useState(0)
    const [ currency, setCurrency] = useState("")
    const [ comment, setComment ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const [ time, setTime ] = useState("")
    const [ returnTime, setReturnTime ] = useState("")
    const Auth = auth.currentUser.uid
    const usersCollectionRef = collection(db, (Auth));

    if(loading) {
        return <Loading />
    }

    const handlename = (e) => {
        setName(e.target.value)
    }
    const handlenumber = (e) => {
        setNumber(e.target.value)
    }
    const handleloan = (e) => {
        setLoan(parseFloat(e.target.value))
    }
    const handleCur = (e) => {
        const Value = e.target.value
        setCurrency(Value)
        console.log(Value);
    }
    const handlecomment = (e) => {
        setComment(e.target.value)
    }
    const handletime = (e) => {
        const timenew = new Date(e.target.value)
        setTime(timenew.getTime());
    }
    const handleReturnTime = (e) => {
        const timenew = new Date(e.target.value)
        setReturnTime(timenew.getTime());
        console.log(returnTime);
        
    }
    

    const createLoan = async () => {
        setLoading(true)
        try {
            const timestamp = Date.now()
            
            if(name !== "" && loan !== 0 && currency !== "") {
                await addDoc (usersCollectionRef, { name, number, loan, currency, comment, timestamp: !time ? timestamp : time, returnTime})
            }
        } catch (error) {
            console.error("qarz qushilmadi");
        }
        setComment('')
        setLoading(false)
    }

    return (
            
        <div className="border-[1px] p-4">
            <form onSubmit={createLoan}>
                <label>
                    Name:<input type="text" className="input border-[1px]" onChange={handlename} required/>
                </label>
                <label>
                    Phone number:<input type="text" className="input border-[1px]" onChange={handlenumber} />
                </label>
                <label>
                    Value:
                    <div className="flex gap-1">
                        <input type="number" className="input border-[1px] appearance-none w-3/4" onChange={handleloan} required/>
                        <select className="input border w-1/4" onChange={handleCur}>
                            <option hidden selected disabled>Currency</option>
                            <option value="UZS">EUR</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                </label>
                <label>
                    Date:<input type="date" className="input border-[1px]" onChange={handletime}/>
                </label>
                <label>
                    Comment:<textarea name="" id="" cols="28" rows="5" className="input border-[1px]" onChange={handlecomment}></textarea>
                </label>
                <button type="submit" className="btn btn-primary w-full font-semibold mt-2">Add debt qo`shish</button>
            </form>

        </div>
            

            
    )
}

export default AddLoan