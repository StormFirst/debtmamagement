import { db } from '../api/firebase';
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import "../styles/DataEdit.css"
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from './Loading';
import { auth } from "../api/firebase"
import { Link } from 'react-router-dom';
function DataEdit() {

    const { id } = useParams();
    const navigate = useNavigate()
    const [ data, setData ] = useState([])
    const [ loan, setLoan ] = useState(0);
    const [ loading, setLoading ] = useState(false)
    const Auth = auth.currentUser.uid
    const docRef = doc(db, (Auth),(id))
 
    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, (Auth),(id))
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()) {
                setData(docSnap.data())
            }
        }
        fetchData()
    }, [id]);

    const handleChange = (e) => {
        setLoan(parseFloat(e.target.value))
    }

    const handleDEC = async () => {
        setLoading(true)
        
        if(loan !== 0) {
            try {
                const payload = { loan: data.loan - loan }
                await updateDoc( docRef, payload)
                
            } catch (error) {
                
            }
        }
        const delay = ms => new Promise(res => setTimeout(res, ms))
        await delay(300)
        window.location.reload(false)
    }
    const handleINC = async () => {
        setLoading(true)
        
        if(loan !== 0) {
            try {
                const payload = { loan: data.loan + loan }
                await updateDoc( docRef, payload)
            } catch (error) {
                
            }
        }
        const delay = ms => new Promise(res => setTimeout(res, ms))
        await delay(300)
        window.location.reload(false)
    }

    const handledelete = async () => {
        setLoading(true)

        try {
            await deleteDoc(docRef)
            navigate('/')
        } catch (error) {
            
        }

        setLoading(false)
    }


    function addLeadingzero(d) {
        return (d < 10) ? '0' + d : d;
    };
    
    function getUsertime (t) {
        let Y = t.getUTCFullYear();
        let M = addLeadingzero(t.getMonth() + 1)
        let D = addLeadingzero(t.getDate());
        return `${D}.${M}.${Y}`
    };


    if(loading) {
        return <Loading />
    }

    return (
        <div className='p-4 text-center'>
            <div className='flex gap-2 justify-center'>
                <Link to="/" className='btn btn-outline-dark text-sm font-semibold'>Back</Link>
                <button className='btn btn-danger font-semibold text-sm' onClick={() => handledelete(id)}>Delete debt</button>
            </div>
            
            <div className='mt-3 border-t p-2'>
                <p className='text-lg'>Name: <b>{data.name}</b></p>
                <p className='text-lg'>Phone number: <b>{data.number}</b></p>
                <p className='text-md'>Debt: <b>{data.loan} {data.currency}</b></p>
                <p className='text-md'>Date: <b>{getUsertime(new Date(data.timestamp))}</b></p>
                <p className='text-md'>Comment: {data.comment}</p>

            </div>
            
            <div className='flex gap-2 mt-3 border-t p-2 justify-center'>
                <div className='flex flex-col gap-2 w-[300px] bg-white border p-4 rounded-md'>
                    <p className='font-semibold'>Debt minus</p>
                    <form onSubmit={() =>  handleDEC(id)} className='flex flex-col gap-2'>
                        <input className='input border' type="text" onChange={handleChange}/>
                        <button type='submit' className='btn btn-outline-dark font-semibold'>Minus</button>
                    </form>
                </div>

                <div className='flex flex-col gap-2 w-[300px] bg-white border p-4 rounded-md'>
                    <p className='font-semibold'>Debt plus</p>
                    <form onSubmit={() =>  handleINC(id)} className='flex flex-col gap-2'>
                        <input className='input border' type="text" onChange={handleChange}/>
                        <button type='submit' className='btn btn-outline-dark font-semibold'>Plus</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default DataEdit