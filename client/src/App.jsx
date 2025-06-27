import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Loginpage from './pages/Loginpage'
import ProfilePage from './pages/ProfilePage'
import assets from './assets/assets'
import {Toaster} from "react-hot-toast"


const App = () => {
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster/>
      <Routes>
         <Route path="/" element={<HomePage/>}/>
         <Route path="/login" element={<Loginpage/>}/>
         <Route path="/profile" element={<ProfilePage/>}/>
      </Routes>
    </div>
  )
  
}

export default App
