
import "../styles/Main.css"
import MainData from "../components/MainData";

import { useUserContext } from "../context/userContext";
import logo from '../assets/images/logo.svg'
import { Link } from "react-router-dom";
import AddLoan from "../components/AddLoan";

function MainPage() {
    
    const { logoutUser } = useUserContext();
    
    const handleLogout = async () => {
        const confirmLogout = window.confirm('Log out?')
        if(confirmLogout){
            try {
              await logoutUser();
    
            } catch (error) {
              console.log(error.message);
            }
        }else{
            console.log('nothing');
        }
    };

    return (
        
        <div className="p-3 sm:p-6 max-w-7xl m-auto">
            <div className="mb-4 border-b-[1px] pb-2 flex items-center justify-between">
                <div>
                    <Link to="/" className="inline-block"><img src={logo} alt="logo" /></Link>
                    <p className="text-sm text-gray-700 mt-[-8px]">Deb Management</p>
                </div>
                <div>
                    <button className="btn btn-outline-danger font-semibold text-sm" onClick={handleLogout}>Log out</button>
                </div>
            </div>
            <div className="flex gap-2 m-auto">

                <MainData />
                
                <div className="w-1/3 hidden sm:block">
                    <AddLoan />
                </div>

                

            </div>
            

            
        </div>
    )
}

export default MainPage