import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import "./register.css"
import Cookies from 'js-cookie'


const Login = () => {
    const navigate = useNavigate();

    const [phone,setPhone]=useState('')
    const [password,setPassword]=useState('')
    async function handleLog(event)
    {
        event.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/login", {
              password: password,
              phone:phone
            });
            if (res.data && res.data.message) {
              if (res.status === 200 && res.data.token && res.data.phone) {
                Cookies.set('acctoken',res.data.token)
                Cookies.set('uid',res.data.phone)
                navigate("/dashboard");
                console.log("Login Successful")
              }
            } else {
              console.log("Error : ", res);
            }
          } catch (error) {
            console.log("error occured at login 44", error);
          }

    }
  return (
  <div style={{width:'100vw',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
    <form className='logreg' action="" onSubmit={handleLog} style={{width:'30vw',display:'flex',flexDirection:'column',gap:'10px'}}>
        <h1>Login Here</h1>
        <input type="text"  className='login_input'  placeholder='phone number' onChange={(event) => setPhone(event.target.value)} />
        <input type="password"  className='login_input' name="" id="" placeholder='password' onChange={(event) => setPassword(event.target.value)}/>
        <input type="submit" style={{width:'50%',position:'relative',left:'50px',backgroundColor:'green',color:"white",cursor:'pointer'}} className='login_input' value="Login" />
    </form>
  </div>
  )
}

export default Login