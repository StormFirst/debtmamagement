import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../api/firebase";
import { FiSearch } from "react-icons/fi";
import { auth } from "../api/firebase";
import AddLoan from "./AddLoan";

export default function MainData() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [oneDay, setOneDay] = useState("");
  const [uzs, setUsdPlus] = useState([]);
  const [minus, setMinus] = useState([]);
  const [plus, setPlus] = useState([]);
  const [usd, setUsdMinus] = useState([]);
  const Auth = auth.currentUser.uid;

  const [showAddLoan, setShowAddLoan] = useState(false);

  const navigate = useNavigate();

  const handleNavigate = (item) => {
    navigate(`/${item.id}`);
  };

  useEffect(() => {
    const Ref = collection(db, Auth);
    const q = query(Ref, orderBy("timestamp", "desc"));

    const qs = query(
      Ref,
      where("status", "==", "Olindi"),
      where("currency", "==", "UZS")
    );
    const qS = query(
      Ref,
      where("status", "==", "Berildi"),
      where("currency", "==", "UZS")
    );

    const qd = query(
      Ref,
      where("status", "==", "Olindi"),
      where("currency", "==", "USD")
    );
    const qD = query(
      Ref,
      where("status", "==", "Berildi"),
      where("currency", "==", "USD")
    );

    const q1 = query(Ref, where("timestamp", ">=", oneDay));

    onSnapshot(qs, (snapshot) =>
      setMinus(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );

    onSnapshot(qS, (snapshot) =>
      setPlus(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );

    onSnapshot(qd, (snapshot) =>
      setUsdPlus(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );

    onSnapshot(qD, (snapshot) =>
      setUsdMinus(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );

    if (oneDay === "") {
      onSnapshot(q, (snapshot) =>
        setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
    } else {
      onSnapshot(q1, (snapshot) =>
        setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
    }
  }, [date, time, oneDay]);

  const totlaLoanUzs = uzs.reduce((tl, item) => tl + item.loan, 0);
  const totlaLoanUsd = usd.reduce((tl, item) => tl + item.loan, 0);
  const totalMinus = minus.reduce((tl, item) => tl + item.loan, 0);
  const totalPlus = plus.reduce((tl, item) => tl + item.loan, 0);
  const numberFormat = new Intl.NumberFormat("ru-RU");

  const TotalLoanUzs = numberFormat.format(totlaLoanUzs);
  const TotalLoanUsd = numberFormat.format(totlaLoanUsd);
  const TotalMinus = numberFormat.format(totalMinus);
  const TotalPlus = numberFormat.format(totalPlus);
  const filterName = (e) => {
    setSearch(e.target.value);
  };

  const filterOneday = (e) => {
    const timenew = new Date(e.target.value);
    setOneDay(timenew.getTime());
  };

  const filterDate = (e) => {
    const timenew = new Date(e.target.value);
    setDate(timenew.getTime());
  };

  const filterdate = (e) => {
    const timenew = new Date(e.target.value);
    setTime(timenew.getTime());
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

  return (
    <div className="w-full sm:w-4/6 border p-2">
      <div className="inputDiv flex w-full justify-between gap-2 flex-wrap sm:flex-nowrap">
        <label className="w-full sm:w-3/4">
          Qidiruv:
          <div className="flex items-center border-[1px] rounded bg-white">
            <FiSearch className="text-lg w-10" />
            <input
              type="text"
              className="input"
              onChange={filterName}
              placeholder="Ismi bo'yicha"
            />
          </div>
        </label>

        <label className="items-center w-full sm:w-1/4">
          Sana:
          <input
            type="date"
            className="input border-[1px]"
            onChange={filterOneday}
          />
        </label>

        {/* <label className="items-center w-full sm:w-1/4 hidden sm:block">
        ZSanadan:<input type="date" className="input border-[1px]" onChange={filterDate}/>
        </label>
        <label className="items-center w-full sm:w-1/4 hidden sm:block">
            Sanagacha:<input type="date" className="input border-[1px]" onChange={filterdate}/>
        </label> */}
      </div>

      <div className="h-screen-list overflow-auto">
        <table className="mt-4">
          <thead>
            <tr className="">
              <th>№</th>
              <th>Ismi</th>
              {/* <th className="hidden sm:table-cell">Tel nomer</th> */}
              <th>Summa</th>
              <th className="hidden sm:table-cell">Qaytarish sanasi</th>
              <th>Qolgan kun</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((item) => {
                if (search === "") {
                  return item;
                } else if (
                  item.name.toLowerCase().includes(search.toLowerCase())
                ) {
                  return item;
                }
              })
              .map((item, index) => {
                const time = new Date(item.timestamp).getDate();
                const end = new Date(item.returnTime).getDate();
                const result = end - time;
                return (
                  <tr
                    key={item.id}
                    onClick={() => handleNavigate(item)}
                    className={
                      item.status === "Olindi"
                        ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-700 active:bg-slate-900"
                        : "bg-red-100 text-red-900 hover:bg-rose-900 active:bg-slate-900"
                    }
                  >
                    <td className="w-6 text-center">{index + 1}</td>
                    <td>{item.name}</td>
                    <td>
                      {numberFormat.format(item.loan)} {item.currency}
                    </td>
                    <td className="hidden sm:table-cell">
                      {getUsertime(new Date(item.returnTime))}
                    </td>
                    <td>
                      {result + "  kun"} {result <= 0 ? "o'tdi" : "qoldi"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="p-2 block sm:hidden bg-gray-700 w-full h-[154px] fixed left-0 bottom-0">
        <div className="flex justify-between w-full gap-2">
          <div className="p-2 bg-emerald-100 text-center text-emerald-900 border-emerald-900 border hover:bg-emerald-900 hover:text-white transition-all rounded w-1/2">
            <p>Olingan qarz</p>
            <h4 className="text-sm">
              (UZS): <b>{TotalMinus} so'm</b>
            </h4>
            <h4 className="text-sm">
              (USD): <b>{TotalLoanUzs} $</b>
            </h4>
          </div>

          <div className="p-2 text-center bg-rose-100 border-rose-900 border text-rose-900 hover:bg-rose-900 hover:text-white transition-all rounded w-1/2">
            <p>Berilgan qarz</p>
            <h4 className="text-sm">
              (UZS): <b>{TotalPlus} so'm</b>
            </h4>
            <h4 className="text-sm">
              (USD): <b>{TotalLoanUsd} $</b>
            </h4>
          </div>
        </div>
        <button
          className="btn btn-primary w-full h-12 text-base mt-2"
          onClick={() => setShowAddLoan(true)}
        >
          Yangi qarz qo'shish
        </button>
      </div>

      <div className="flex justify-between w-full gap-2">
        <div className="hidden sm:block p-4 mt-[-4px] text-left bg-emerald-100 text-emerald-900 border-emerald-900 border hover:bg-emerald-900 hover:text-white transition-all rounded-xl w-1/2">
          <h4 className="text-xl">
            Olingan qarz (UZS): <b>{TotalMinus} so'm</b>
          </h4>
          <h4 className="text-xl">
            Olingan qarz (USD): <b>{TotalLoanUzs} $</b>
          </h4>
        </div>

        <div className="hidden sm:block p-4 mt-[-4px] text-right bg-rose-100 border-rose-900 border text-rose-900 hover:bg-rose-900 hover:text-white transition-all rounded-xl w-1/2">
          <h4 className="text-xl">
            Berilgan qarz (UZS): <b>{TotalPlus} so'm</b>
          </h4>
          <h4 className="text-xl">
            Berilgan qarz (USD): <b>{TotalLoanUsd} $</b>
          </h4>
        </div>
      </div>

      {showAddLoan && (
        <div className="overlay bg-gray-900/80 h-screen fixed top-0 left-0 w-full flex justify-center items-center">
          <div className="bg-gray-50 shadow-xl rounded-xl mx-4 modalAnimation">
            <AddLoan />
            <div className="flex w-full justify-center px-4 pb-4">
              <button
                className="btn btn-outline-dark text-sm font-semibold w-full"
                onClick={() => setShowAddLoan(false)}
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
