import {React} from "react";
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import logo from '../assets/logo.webp';


export default function Navbar({showLogOut,showHome,showMessageLogo}){
    const navigate=useNavigate();

    const logOut=async()=>{

        const response=await fetch('http://localhost:5000/logout',{
            method:'POST',
            headers: {
                "auth-token": localStorage.getItem("auth-token"),
                "Content-Type": "application/json",
            },
        })
        const data=await response.json();
        console.log(data.message);
        localStorage.removeItem('auth-token');
        window.location.replace("/");


    }
    return(
        <div className="navbar">
            {showMessageLogo&&<img src={logo} alt="" className="image" onClick={()=>navigate("/Chat")} />}
            {showHome && <div>
                <i className="fa fa-arrow-left" onClick={()=>navigate("/home")}></i> Back to quizzes
            </div>}
            <div className="right-div">

               
                {showLogOut&&<button className="btn" onClick={logOut}>LogOut</button>}
            </div>
        </div>
    );
}