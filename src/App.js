import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { Chat } from './Chat/Chat';
import { TimeUp } from './TimeUp/TimeUp';
import { Login } from './Login/Login';
import { Home } from './Home/Home';
import { Result } from './Result/Result';





function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/Chat" element={<Chat />}></Route>
          <Route path="/home" element={<Home />} />
          <Route path="/Result" element={<Result />} />
          
          <Route path="TimeUp" element={<TimeUp />}></Route>

        </Routes>
      </BrowserRouter>
      
        
    </>
  )
}

export default App

