import { db } from "../api/firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import "../styles/DataEdit.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "./Loading";
import { auth } from "../api/firebase";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.svg";
import { useUserContext } from "../context/userContext";

function DataEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loan, setLoan] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const Auth = auth.currentUser.uid;
  const docRef = doc(db, Auth, id);
  const { logoutUser } = useUserContext();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Tizimdan chiqimoqchimisiz?");
    if (confirmLogout) {
      try {
        await logoutUser();
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log("nothing");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, Auth, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setLoan(parseFloat(e.target.value));
  };

  const handleDEC = async () => {
    setLoading(true);

    if (loan !== 0) {
      try {
        const payload = { loan: data.loan - loan };
        await updateDoc(docRef, payload);
      } catch (error) {}
    }
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(300);
    window.location.reload(false);
  };
  const handleINC = async () => {
    setLoading(true);

    if (loan !== 0) {
      try {
        const payload = { loan: data.loan + loan };
        await updateDoc(docRef, payload);
      } catch (error) {}
    }
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(300);
    window.location.reload(false);
  };

  const handleSta = async (e) => {
    const Value = e.target.value;
    setStatus(Value);
  };

  const update = async () => {
    setLoading(true);

    try {
      const payload = { status: status };
      await updateDoc(docRef, payload);
    } catch (error) {}
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(300);
    window.location.reload(false);
  };

  const handledelete = async () => {
    setLoading(true);
    if (window.confirm("Qarzni o'chirishni tasdiqlaysizmi?")) {
      try {
        await deleteDoc(docRef);
        navigate("/");
      } catch (error) {}
    }

    setLoading(false);
  };

  function addLeadingzero(d) {
    return d < 10 ? "0" + d : d;
  }

  function getUsertime(t) {
    let Y = t.getUTCFullYear();
    let M = addLeadingzero(t.getMonth() + 1);
    let D = addLeadingzero(t.getDate());
    return `${D}.${M}.${Y}`;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl m-auto">
      <div className="mb-4 border-b-[1px] pb-2 flex items-center justify-between">
        <div>
          <Link to="/" className="inline-block">
            <img src={logo} alt="logo" />
          </Link>
          <p className="text-sm text-gray-700 mt-[-8px]">Debt Management</p>
        </div>
        <div>
          <Link to="/" className="btn btn-outline-dark text-sm font-semibold">
            Qaytish
          </Link>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <div className="w-full sm:w-1/2 border p-4 bg-white">
          <p className="text-lg">
            Ismi: <b>{data.name}</b>
          </p>
          <p className="text-lg">
            Tel nomer: <b>{data.number}</b>
          </p>
          <p className="text-md">
            Summa:{" "}
            <b>
              {data.loan} {data.currency}
            </b>
          </p>
          <p className="text-md">
            Sana: <b>{getUsertime(new Date(data.timestamp))}</b>
          </p>
          <p className="text-md">
            Izoh: <b>{data.comment}</b>
          </p>
          <p className="text-md">
            Status: <b>{data.status}</b>
          </p>
        </div>

        <div className="flex flex-col w-full sm:w-1/2 bg-white p-4 border gap-3">
          <div className="flex gap-6 justify-center  flex-wrap sm:flex-nowrap">
            <div className="w-full sm:w-1/3">
              <p className="font-semibold">Qarz ayirish</p>
              <form
                onSubmit={() => handleDEC(id)}
                className="flex flex-col gap-2"
              >
                <input
                  className="input border"
                  type="text"
                  onChange={handleChange}
                />
                <button type="submit" className="btn btn-danger font-semibold">
                  Qarz ayirish
                </button>
              </form>
            </div>

            <div className="w-full sm:w-1/3">
              <p className="font-semibold">Qarz qo'shish</p>
              <form
                onSubmit={() => handleINC(id)}
                className="flex flex-col gap-2"
              >
                <input
                  className="input border"
                  type="text"
                  onChange={handleChange}
                />
                <button
                  type="submit"
                  className="btn btn-primary bg-emerald-500 font-semibold"
                >
                  Qarz qo'shish
                </button>
              </form>
            </div>

            <div className="w-full sm:w-1/3">
              <label className="">
                <span className="font-semibold">Statusni yangilash:</span>
                <select
                  className="input border w-full"
                  required
                  onChange={handleSta}
                >
                  <option hidden selected disabled>
                    {data.status}
                  </option>
                  <option value="Olindi">Qarz olingan</option>
                  <option value="Berildi">Qarz berilgan</option>
                </select>
              </label>

              <button className="btn btn-primary w-full mt-2" onClick={update}>
                Yangilash
              </button>
            </div>
          </div>
          <button
            className="btn btn-outline-danger font-semibold text-sm"
            onClick={() => handledelete(id)}
          >
            Qarzni o'chirish
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataEdit;
