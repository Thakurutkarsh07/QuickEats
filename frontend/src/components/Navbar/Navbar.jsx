import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Navbar = ({setShowLogin}) => {
  const [menu, setMenu] = useState("Home");
  
  return (
    <div className="navbar">
      <img src={assets.logo} alt="" />
      <ul className="navbar-menu">
        <Link to='/' onClick={()=>setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
        <a href="#explore-menu" onClick={()=>setMenu("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</a>
        <a href="#app-download" onClick={()=>setMenu("Mobile-App")} className={menu === "Mobile-App" ? "active" : ""}>Mobile-App</a>
        <a href="#footer" onClick={()=>setMenu("Contact-us")} className={menu === "Contact-us" ? "active" : ""}>Contact-us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <img src={assets.basket_icon} alt="" />
          <div className="dot"></div>
        </div>
        <button onClick={()=>setShowLogin(true)} >SignIn</button>
      </div>
    </div>
  );
};

export default Navbar;
