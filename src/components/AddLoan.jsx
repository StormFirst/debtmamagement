import { useState } from "react";
import Loading from "../components/Loading";
// firebase
import { db } from "../api/firebase";
import { collection, addDoc } from "firebase/firestore";
import "../styles/Main.css";
import { auth } from "../api/firebase";

function AddLoan() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [loan, setLoan] = useState(0);
  const [currency, setCurrency] = useState("");
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const Auth = auth.currentUser.uid;
  const usersCollectionRef = collection(db, Auth);

  if (loading) {
    return <Loading />;
  }

  const handlename = (e) => {
    setName(e.target.value);
  };
  const handlenumber = (e) => {
    setNumber(e.target.value);
  };
  const handleloan = (e) => {
    setLoan(parseFloat(e.target.value));
  };
  const handleCur = (e) => {
    const Value = e.target.value;
    setCurrency(Value);
  };
  const handleSta = (e) => {
    const Value = e.target.value;
    setStatus(Value);
  };
  const handlecomment = (e) => {
    setComment(e.target.value);
  };

  const handletime = (e) => {
    const timenew = new Date(e.target.value);
    setTime(timenew.getTime());
  };
  
  const handleReturnTime = (e) => {
    const timenew = new Date(e.target.value);
    setReturnTime(timenew.getTime());
  };

  const createLoan = async () => {
    setLoading(true);
    try {
      const timestamp = Date.now();

      if (name !== "" && loan !== 0 && currency !== "") {
        await addDoc(usersCollectionRef, {
          name,
          number,
          loan,
          currency,
          comment,
          timestamp: !time ? timestamp : time,
          returnTime,
          status,
        });
      }
    } catch (error) {
      console.error("qarz qushilmadi");
    }
    setComment("");
    setLoading(false);
  };

  return (
    <div className="border-0 sm:border-[1px] p-4">
      <form onSubmit={createLoan} className="sm:flex sm:flex-col sm:gap-2">
        <label>
          Ismi:
          <input
            type="text"
            className="input border-[1px]"
            onChange={handlename}
            required
          />
        </label>
        <label>
          Tel:
          <input
            type="text"
            className="input border-[1px]"
            onChange={handlenumber}
          />
        </label>
        <label>
          Summa:
          <div className="flex gap-1">
            <input
              type="number"
              className="input border-[1px] appearance-none w-3/4"
              onChange={handleloan}
              required
            />
            <select className="input border w-1/4" onChange={handleCur}>
              <option hidden selected disabled>
                Valyuta
              </option>
              <option value="UZS">UZS</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </label>
        <label className="flex flex-col">
          <span>Status:</span>
          <select className="input border w-full" required onChange={handleSta}>
            <option hidden selected disabled>
              Status
            </option>
            <option value="Olindi">Qarz olish</option>
            <option value="Berildi">Qarz berish</option>
          </select>
        </label>
        <label>
          Sana:
          <input
            type="date"
            className="input border-[1px]"
            onChange={handletime}
          />
        </label>
        <label>
          Qaytarish sanasi:
          <input
            type="date"
            className="input border-[1px]"
            onChange={handleReturnTime}
          />
        </label>
        <label>
          Izoh:
          <textarea
            name=""
            id=""
            cols="28"
            rows="5"
            className="input border-[1px]"
            onChange={handlecomment}
          ></textarea>
        </label>
        {/* <label>
                    Username:<input type="text"  className="input border-[1px]" onChange={getE} required/>
                </label>
                <label>
                    Password:<input type="text" className="input border-[1px]" onChange={getP} required/>
                </label> */}
        <button
          type="submit"
          className="btn btn-primary w-full font-semibold mt-2"
        >
          Qarz qo'shish
        </button>
      </form>
    </div>
  );
}

export default AddLoan;
