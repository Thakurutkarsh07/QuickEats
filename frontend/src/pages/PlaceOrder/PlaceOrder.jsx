import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const initializeRazorpayPayment = (orderData) => {
    const options = {
      key: orderData.key_id, // Razorpay API Key ID from the backend
      amount: orderData.amount, // Amount in paise
      currency: "INR",
      name: "Food Delivery App", // Displayed on Razorpay Checkout
      description: "Test Transaction",
      order_id: orderData.order_id, // Order ID returned from backend
      handler: async function (response) {
        try {
          const paymentVerificationResponse = await axios.post(
            `${url}/api/order/verify`,
            {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            },
            { headers: { token } }
          );
          if (paymentVerificationResponse.data.success) {
            window.location.href = `${url}/order/success`;
          } else {
            alert("Payment verification failed");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          alert("Payment verification failed");
        }
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phone,
      },
      notes: {
        address: `${data.street}, ${data.city}, ${data.state}, ${data.zipcode}, ${data.country}`,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpayCheckout = new window.Razorpay(options);
    razorpayCheckout.open();
  };

  // const placeOrder = async (event) => {
  //   event.preventDefault();
  //   let orderItems = [];
  //   food_list.forEach((item) => {
  //     if (cartItems[item._id] > 0) {
  //       let itemInfo = item;
  //       itemInfo["quantity"] = cartItems[item._id];
  //       orderItems.push(itemInfo);
  //     }
  //   });

  //   let orderData = {
  //     address: data,
  //     items: orderItems,
  //     amount: getTotalCartAmount() + 2, // Including delivery fee
  //   };

  //   try {
  //     // Send order data to backend
  //     let response = await axios.post(url + "/api/order/place", orderData, {
  //       headers: { token },
  //     });

  //     if (response.data.success) {
  //       // Initialize Razorpay payment
  //       initializeRazorpayPayment(response.data);
  //     } else {
  //       alert(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     alert("There was a problem placing your order.");
  //   }
  // };
  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
  
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };
  
    // Step 1: Create an order via Razorpay
    let orderResponse = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });
  
    if (orderResponse.data.success) {
      const { order_id, amount, key_id } = orderResponse.data;
  
      // Step 2: Initialize Razorpay
      var options = {
        key: key_id, // Razorpay key_id
        amount: amount, // Amount to pay
        currency: "INR",
        name: "Food Delivery", // Your company/product name
        description: "Order #1234",
        order_id: order_id, // The Razorpay order ID
        handler: async function (response) {
          // Step 3: Send payment details to the backend for verification
          let paymentVerificationResponse = await axios.post(
            `${url}/api/order/verify`,
            {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            },
            { headers: { token } }
          );
  
          if (paymentVerificationResponse.data.success) {
            // Payment verified successfully, redirect user
            window.location.href = "/thank-you";
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: data.firstName + " " + data.lastName,
          email: data.email,
          contact: data.phone,
        },
      };
  
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      alert("Error creating order. Please try again.");
    }
  };
  

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
