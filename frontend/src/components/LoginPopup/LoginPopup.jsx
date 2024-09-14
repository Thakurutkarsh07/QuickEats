import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure this is imported

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const onLogin = async (e) => {
    e.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl = newUrl + "/api/user/login";
    } else {
      newUrl = newUrl + "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
        toast.success("Login successful! Welcome back.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={onLogin}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign up" && (
            <input
              type="text"
              placeholder="Your name"
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              required
            />
          )}
          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Your email"
            required
          />
          <input
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">
          {currState === "Sign up" ? "Create account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default LoginPopup;
