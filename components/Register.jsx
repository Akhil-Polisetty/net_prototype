import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./register.css"

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [emailId, setEmail] = useState("");
  const [phone_no,setPhone]=useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confpassword) {
      console.log("password does not match");
    } else {
      try {
        const res = await axios.post("http://localhost:8080/register", {
          name: username,
          email: emailId,
          password: password,
          phone:phone_no
        });
        if (res.data && res.data.message) {
          if (res.status === 200) {
              console.log("all ok")
            navigate("/signin");
          }
        } else {
          console.log("Error : ", res);
        }
      } catch (error) {
        console.log("error occured at signup 44", error);
      }
    }
  }

  return (
    <div style={{width:'100vw',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
    <form  className='logreg' onSubmit={handleSubmit}  style={{width:'30vw',display:'flex',flexDirection:'column',gap:'10px'}}>
      <h3>Signup Here</h3>
      <input
        className="login_input"
        type="text"
        placeholder="Enter Username"
        id="username"
        onChange={(event) => setUsername(event.target.value)}
      />
      <input
        className="login_input"
        type="email"
        placeholder="Email id"
        id="email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        className="login_input"
        type="password"
        placeholder="Password"
        id="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <input
        className="login_input"
        type="password"
        placeholder="confirm password"
        id="cpassword"
        onChange={(event) => setConfPassword(event.target.value)}
      />
      <input
        className="login_input"
        type="text"
        placeholder="phone number"
        id="phone_number"
        onChange={(event) => setPhone(event.target.value)}
      />

      <button style={{ width:'50%',position:'relative',left:'50px',backgroundColor:'blue',color:'white',cursor:'pointer',borderRadius:"20px" }} type="submit">
        Sign Up
      </button>
      <p style={{ marginTop: "20px",position:'relative',left:'50px' }}>
        Already Have an Account ?
        <a href="/signin" className="signup_btn">
          Login here
        </a>
      </p>
    </form></div>
  );
};
export default Register;
