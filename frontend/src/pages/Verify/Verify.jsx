import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      console.log("Verifying payment with data:", { success, orderId });
      const response =  await axios.post(`${url}/api/order/verified`, { order_id: orderId });
      // const response = await axios.post(`${url}/api/order/verified`, { success, orderId });
      console.log("Server response:", orderId);
      
      if (response.data.success) {
        navigate("/MyOrders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(orderId)
      console.error("Error verifying payment:", error.response ? error.response.data : error.message);
      navigate("/");
    }
  };
  

  useEffect(() => {
    verifyPayment();
  }, [success, orderId, url, navigate]);

  return (
    <div className='verify'>
      <div className="spinner">
        {/* You can add an actual spinner here */}
        <p>Verifying payment...</p>
      </div>
    </div>
  );
};

export default Verify;
