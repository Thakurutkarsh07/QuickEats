import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
const LoginPopup = ({ setShowLogin }) => {
  const {url} = useContext(StoreContext)
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name:"",
    email: "",
    password: "",
  });
const onChangeHandler=(e)=>{
  const {name,value}=e.target;
  setData({...data,[name]:value})
}


  return (
    <div className="login-popup">
      <form className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input type="text" placeholder="Your name" name="name" onChange={onChangeHandler} value={data.name} required />
          )}
          <input type="email" name="email" onChange={onChangeHandler} value={data.email} placeholder="Your email" required />
          <input type="password" name="password" onChange={onChangeHandler} value={data.password} placeholder="password" required />
        </div>
        <button>{currState === "Sign up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login"?<p>Create a new account? <span onClick={()=>setCurrState("Sign up")}>Click here</span></p>:<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>}
        
      </form>
    </div>
  );
};

export default LoginPopup;
