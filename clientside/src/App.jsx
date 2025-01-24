import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Register from './components/pages/Register'
import Login from './components/pages/Login'
import Email from './components/pages/Email'
import Fpassword from './components/pages/Fpassword'
import Home from './components/pages/Home'
import Contact from './components/pages/Contact'
import Nav from './components/pages/Nav'
import { useState } from 'react'
import Message from './components/pages/Message'
import Profile from './components/pages/Profile'

function App() {
  const [user,setUser]=useState("")

  return (
    <BrowserRouter>
    {user &&<Nav  user={user} setUser={setUser} />}
      <Routes>
        <Route path='/' element={<Home setUser={setUser}/>}/>
        <Route path='/signin' element={<Login/>}/>
          <Route path='/signup' element={<Register/>}/>
          <Route path='/email' element={<Email/>}/>
          <Route path='/confirmpassword' element={<Fpassword />}/>
          <Route path='/contacts' element={<Contact setUser={setUser} />}/>
          <Route path='/chat/:_id' element={<Message setUser={setUser} />}/>
          <Route path='/userprofile/:_id' element={<Profile setUser={setUser} />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
