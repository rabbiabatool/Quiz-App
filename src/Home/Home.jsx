import React  from "react"
import Navbar from "../Navbar/Navbar"
import { Quizes } from "../Quizes/Quizes";

export const Home=()=>{

 
    return(
        <>
         <Navbar showLogOut={false} showHome={false} showMessageLogo={true} />
         <Quizes />
        </>
    )
}