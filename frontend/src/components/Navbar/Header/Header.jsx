import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate(); // Define navigate

  return (
    <div className="header">
      <div className="header-contents">
        <h2>Savor the Speed of Flavor!</h2>
        <p>
          From savory to sweet, our offerings cater to every palate. Experience culinary excellence with every bite, prepared with care and expertise.
        </p>
        
        <button onClick={() => navigate("/menu")}>View Menu</button>
      </div>
    </div>
  );
};

export default Header;