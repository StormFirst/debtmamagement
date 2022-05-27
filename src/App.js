// components
import Loading from "./components/Loading";
import { useUserContext } from "./context/userContext";
// pages
import Dashboard from './pages/Dashboard';
// styles
import "react-toastify/dist/ReactToastify.css"
// toastify
import { ToastContainer } from "react-toastify";
import Auth from "./components/Auth";

function App() {
  const { user, loading } = useUserContext();
  if (loading) {
    return <Loading />
  }
  return (
    <div className="main bg-gray-50">
      {loading ? <Loading /> : <> {user ? <Dashboard /> : <Auth />} </>}
      <ToastContainer/>
    </div >
  );
}

export default App;