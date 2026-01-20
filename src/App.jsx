import React from 'react'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Coin from './pages/Coin/Coin'
import Footer from './components/Navbar/Footer/Footer'
import SignUp from './components/signup/SignUP'
import SignIn from './components/signin/SignIn'

const App = () => {
  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/coin/:coinId' element={<Coin/>}/>
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/SignIn' element={<SignIn/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App