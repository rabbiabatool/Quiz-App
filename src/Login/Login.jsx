import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Forms-nav.css";
import "./Registration.css";
import "./Main.css";
import logo1 from "../assets/Find iT logo 1 (Edited).png";

export const Login = () => {
    const [credentials, setCredentials] = useState({ RegNo: "" });

    const [regError, setRegError] = useState(false);
    const [callingStatus, setCallingStatus] = useState(false);
    const [logOut,setLogOut]=useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Disable back and forward buttons
        const preventBackForward = () => {
          window.history.pushState(null, document.title);
          window.history.replaceState(null, document.title);
    
          // Trap the back navigation in the history stack
          window.onpopstate = () => {
            window.history.pushState(null, document.title);
            window.history.replaceState(null, document.title);
          };
        };
    
        // Call the function to disable navigation
        preventBackForward();
    
        // Cleanup function
        return () => {
          window.onpopstate = null;  // Remove the event listener when component unmounts
        };
      }, []);

    useEffect(() => {
        const fetchStatus = async () => {

            const response = await fetch('http://localhost:5000/getStatus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            setCallingStatus(data.showContent);
            if (!data.showContent) {
                navigate("/Result");

            }

        }
        fetchStatus();
    }, [callingStatus]);

    const logOutHandler=async()=>{

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        let ResponseData;

        await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/form-data',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ RegNo: credentials.RegNo })
        }).then((resp) => resp.json()).then((data) => ResponseData = data)

        if (ResponseData.token) {
            localStorage.setItem('auth-token', ResponseData.token);
            localStorage.setItem('key', JSON.stringify(credentials.RegNo));
            setRegError(false);
            navigate("/home");
        }

        else if (ResponseData.regError) {
            setRegError(true);
        }
        else {
            alert(ResponseData.error);
            setLogOut(true);

        }

    }

    return (
        <>
            <div className="nav-cantainer">
                <div className="upper-part-div">
                    <div className="logo-div">
                        <img src={logo1} className="logo" alt="Logo" />
                    </div>
                </div>
            </div>

            <div className="Wrapper">
                <div className="left-div">
                    <h3>LOGIN</h3>
                    <div className="h3-div">
                        <h3>TO</h3>
                        <h3>YOUR</h3>
                    </div>
                    <h3>ACCOUNT</h3>
                </div>

                <div className="right-div">
                    <div className="more-gather">
                        <div className="gather-div">
                            <div className="img-div">
                                <img src={logo1} alt="Logo" className="logo-1" />
                            </div>

                            <div className="Form-div">
                                <div className="Reg-div">
                                    <div className="form-head">REG</div>
                                    <div className="form-input">
                                        <input
                                            type="text"
                                            name="RegNo"
                                            className="js-reg-ele"
                                            value={credentials.RegNo}
                                            onChange={handleInputChange}
                                            placeholder="2022-SE-xx"
                                        />
                                    </div>
                                </div>


                                <div className="Button-div">
                                    <button
                                        className="login-btn js-log-in-button"
                                        onClick={handleLogin}
                                    >
                                        LOGIN
                                    </button>
                                </div>
                                {logOut && <div style={{color:"purple"}} onClick={logOutHandler}>Log out?</div>}

                                {regError && <p style={{ color: "red", margin: "0px", marginBottom: "2px", padding: "0px" }}>Unauthenticated Registration number</p>}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
