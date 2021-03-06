import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DataEdit from '../components/DataEdit'
import MainPage from './MainPage'
import PhoneReg from './PhoneReg'
import SigninPhone from './SigninPhone'
function Dashboard() {
  return (
    <div className='h-[100vh]'>
      <Router>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/:id' element={<DataEdit />} />
          <Route path='/signupphone' element={<SigninPhone />} />
          <Route path='/phonereg' element={<PhoneReg />} />
        </Routes>
      </Router>
    </div>
  )
}

export default Dashboard