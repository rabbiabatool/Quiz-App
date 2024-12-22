import React, { useEffect, useState } from "react"
import Navbar from "../Navbar/Navbar"
import { useNavigate } from "react-router-dom"

export const Result = () => {

    const navigate = useNavigate();
    const [counter,setCounter]=useState(3);
    const [showAttempt, setShowAttempt] = useState(true);
    // localStorage.setItem("counter",counter);
    useEffect(()=>{

        // localStorage.setItem("counter",3);
        // const stored=localStorage.getItem("counter",counter);
        // console.log(Number(stored));

        const stored=localStorage.getItem("counter",counter);
        console.log(Number(stored));
        if(stored){
            // setShowAttempt(true);
            setCounter(Number(stored));
        }else{
            // setShowAttempt(true);
            localStorage.setItem("counter",counter);
           
        }
    },[])
 

    const DecrementAttempt = async () => {
        setCounter((prevCounter)=>{
            const newCounter=prevCounter-1;
            localStorage.setItem("counter",newCounter);
            return newCounter;

        })
       
        const response = await fetch('http://localhost:5000/DecrementAttempts', {
            method: 'POST',
            headers: {
                "auth-token": `${localStorage.getItem("auth-token")}`,
                "Content-Type": "application/json",
            },
        })
        const data = await response.json();

        if (data.error) {
            console.log(data.error);
        }

    }

    const setShowContent = async () => {
        const s = false;


        await fetch(`http://localhost:5000/setStatus/${s}`, {
            method: 'PUT',
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("success", data.success);
        })
        .catch((error) => {
            console.error("Error for status ", error);
        })

    }


    const AttemptAgain = async () => {

        // const response = await fetch('http://localhost:5000/getCompletedQuiz', {
        //     method: 'GET',
        //     headers: {
        //         "auth-token": localStorage.getItem("auth-token"),
        //         "Content-Type": "application/json",
        //     },
        // })
        // const data = await response.json();
        // const completedQuiz = data.CompletedQuizes;

        // const status = completedQuiz.some(c => c.AllowedAttempts === 0);

        const counter=localStorage.getItem("counter");
        const Counter=Number(counter);
        console.log("attempt",Counter);

        if (Counter===1) {
            console.log("here");
            setShowAttempt(false);
            await setShowContent();

            localStorage.setItem("counter",Counter+2);
          
         
        }
        else {
            console.log("In this block");
            DecrementAttempt();
            navigate("/home");
        }


    }
    return (
        <>
            <Navbar showLogOut={true} showHome={false} showMessageLogo={false} />
            <div className="attempt-btn">{showAttempt && <button onClick={AttemptAgain}>Attempt again?</button>}</div>
            <div className="main">
                <h1>Stay Updated With Your Result!</h1>
            </div>
        </>
    )
}