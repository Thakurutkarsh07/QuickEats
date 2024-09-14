import { createContext, useEffect, useState, useMemo } from "react";
import { food_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const url = "http://localhost:3000";
  const [food_list, setFoodList] = useState([]);
  const addToCart = async (itemId) => {
    const newCartItems = {
      ...cartItems,
      [itemId]: (cartItems[itemId] || 0) + 1,
    };

    try {
      setCartItems(newCartItems);
      if (token) {
        console.log(itemId);
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

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) - 1,
    }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const item = food_list.find((product) => product._id === itemId);
      return item ? total + item.price * cartItems[itemId] : total;
    }, 0);
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };
  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = useMemo(
    () => ({
      food_list,
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      url,
      setToken,
      token,
    }),
    [cartItems, token]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
