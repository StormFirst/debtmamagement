import { collection, onSnapshot, query, where} from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { db } from "../api/firebase";
import { FiSearch, FiEdit } from "react-icons/fi";
import { auth } from "../api/firebase";
import AddLoan from "./AddLoan";

export default function MainData() {

    const [ data, setData ] = useState([]);
    const [ search, setSearch ] = useState("");
    const [ date, setDate ] = useState("")
    const [ time, setTime ] = useState("");
    const [ oneDay, setOneDay ] = useState("");
    const [ uzs, setUzs ] = useState([])
    const [ usd, setUsd ] = useState([])
    const Auth = auth.currentUser.uid;
    
    const [showAddLoan, setShowAddLoan] = useState(false);


    const navigate = useNavigate();

    const handleNavigate = (item) => {
        navigate(`/${item.id}`)
    }

    useEffect(() => {

        const Ref =  collection(db, (Auth));
        const q = query(Ref, where("timestamp", ">=", (date)), where("timestamp", "<=", (time)));
        const q1 = query(Ref, where("timestamp", ">=", (oneDay)));
        const q2 = query(Ref, where("currency", "==", "UZS"));
        const q3 = query(Ref, where("currency", "==", "USD"))

        onSnapshot(q2, (snapshot) => 
            setUzs(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))   
        )

        onSnapshot(q3, (snapshot) => 
            setUsd(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))   
        )

        if (date === "") {
            if (oneDay === "") {
                onSnapshot(Ref, (snapshot) => 
                    setData(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))   
                )
            } else {
                onSnapshot(q1, (snapshot) => 
                    setData(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))   
                ) 
            }
        } else {
            onSnapshot(q, (snapshot) => 
                setData(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))   
            )
        }
        
    },[date, time, oneDay, ]);

    

    const totlaLoanUzs = uzs.reduce((tl, item ) => tl + item.loan, 0);
    const totlaLoanUsd = usd.reduce((tl, item ) => tl + item.loan, 0);
    // const options = { style: 'currency', currency: 'UZS', currencyDisplay: 'symbol', minimumFractionDigits: 0 };
    const numberFormat = new Intl.NumberFormat('ru-RU');

    const TotalLoanUzs = numberFormat.format(totlaLoanUzs);
    const TotalLoanUsd = numberFormat.format(totlaLoanUsd);
    const filterName = (e) => {
        setSearch(e.target.value)
    };

    const filterOneday  = (e) => {
        const timenew = new Date(e.target.value)
        setOneDay(timenew.getTime());
    };

    const filterDate  = (e) => {
        const timenew = new Date(e.target.value)
        setDate(timenew.getTime());
    };

    const filterdate  = (e) => {
        const timenew = new Date(e.target.value)
        setTime(timenew.getTime());
    };

    function addLeadingzero(d) {
        return (d < 10) ? '0' + d : d;
    };
    
    function getUsertime (t) {
        let Y = t.getUTCFullYear();
        let M = addLeadingzero(t.getMonth() + 1)
        let D = addLeadingzero(t.getDate());
        return `${D}.${M}.${Y}`
    };

    return (
        <div className="w-full sm:w-4/6 border p-2">
            <div className="inputDiv flex w-full justify-between gap-2 flex-wrap sm:flex-nowrap">
                <label className="w-full sm:w-1/4">Search:
                    <div className="flex items-center border-[1px] rounded bg-white">
                        <FiSearch className='text-lg w-10'/>
                        <input type="text" className="input" 
                            onChange={filterName} 
                        />
                    </div>
                </label>
                <label className="items-center w-full sm:w-1/4">
                    Date:<input type="date" className="input border-[1px]" onChange={filterOneday}/>
                </label>
                
                {/* <label className="items-center w-full sm:w-1/4 hidden sm:block">
                    Sanadan:<input type="date" className="input border-[1px]" onChange={filterDate}/>
                </label>
                <label className="items-center w-full sm:w-1/4 hidden sm:block">
                    Sanagacha:<input type="date" className="input border-[1px]" onChange={filterdate}/>
                </label> */}
                
            </div>

            <div className="h-screen-300 overflow-auto">
                <table className="mt-4">

                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Name</th>
                            {/* <th className="hidden sm:table-cell">Tel nomer</th> */}
                            <th>Value</th>
                            <th className="hidden sm:table-cell">Date</th>
                        </tr>
                    </thead>
                    <tbody>

                        {data.filter((item) => {
                            if(search === "") {
                                return item
                            } else if (item.name.toLowerCase().includes(search.toLowerCase())) {
                                return item
                            }
                        }).map((item, index) => {
                            const time = !getUsertime(new Date(item.returnTime)) ? "" : getUsertime(new Date(item.returnTime))
                            return (
                                <tr key={item.id} onClick={() => handleNavigate(item)}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    {/* <td className="hidden sm:table-cell">{item.number}</td> */}
                                    <td>{numberFormat.format(item.loan)} {item.currency}</td>
                                    <td className="hidden sm:table-cell">{getUsertime(new Date(item.timestamp))}</td>
                                </tr>
                            )
                        })
                    }

                    </tbody>

                </table>
            </div>

            <div className="fixed bottom-0 bg-gray-200 left-0 px-4 py-2 w-full flex justify-between sm:hidden">
                <div>
                    <h4 className="text-md">Total debt (EUR): <b>{TotalLoanUzs} €</b></h4>
                    <h4 className="text-md">Total debt (USD): <b>{TotalLoanUsd} $</b></h4>
                </div>
                <button className="btn btn-primary w-12 h-12 text-2xl" onClick={() => setShowAddLoan(true)}>+</button>
            </div>

            <div className="hidden sm:block p-4 mt-[-4px] text-right">
                <h4 className="text-xl">Total debt (EUR): <b>{TotalLoanUzs} €</b></h4>
                <h4 className="text-xl">Total debt (USD): <b>{TotalLoanUsd} $</b></h4>
            </div>
            
            {showAddLoan && (
                <div className="fixed top-0 left-0 bg-gray-50 shadow-xl">
                    <AddLoan />
                    <div className="flex w-full justify-center px-4 py-2">
                        <button className="btn btn-outline-dark text-sm font-semibold w-full" onClick={() => setShowAddLoan(false)}>Close</button>
                    </div>
            </div>
            )}
            

        </div>
        
    )
}
