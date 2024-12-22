import React, { useEffect, useState } from "react"
import Navbar from "../Navbar/Navbar"


export const TimeUp = () => {
   
    useEffect(()=>{

        const setShowContent=async()=>{
            const s=false;
            try{
    
                await fetch(`http://localhost:5000/setStatus/${s}`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    }
                });
                console.log("got status");
            }catch(error){
                console.error(error);
            }
    
        }
        setShowContent();
    },[])


   
    return (
        <>
            <Navbar showLogOut={true} showHome={false} showMessageLogo={false} />
            <div className="main">
                <h1>Time Up!Stay Updated With Your Result!</h1>
            </div>
        </>
    )
}