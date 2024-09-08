import { createContext, useEffect, useState, useMemo } from "react";
import { food_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const url = "http://localhost:3000";

  const addToCart = async (itemId) => {
    const newCartItems = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };

    try {
      setCartItems(newCartItems);
      if (token) {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Optionally roll back the state if needed
      setCartItems(cartItems);
    }
  };

  const removeFromCart = (itemId) => {
    if (cartItems[itemId] > 0) {
      setCartItems((prev) => {
        const updatedCart = { ...prev };
        updatedCart[itemId] = prev[itemId] - 1;
        if (updatedCart[itemId] === 0) delete updatedCart[itemId];
        return updatedCart;
      });
    }
  };

  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const item = food_list.find((product) => product._id === itemId);
      return item ? total + item.price * cartItems[itemId] : total;
    }, 0);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const contextValue = useMemo(() => ({
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    setToken,
    token,
  }), [cartItems, token]);

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
