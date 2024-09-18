import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { assets } from '../../assets/assets'

const MyOrders = () => {
    const { url, token } = useContext(StoreContext)
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);  // Add loading state

    const fetchOrders = async () => {
        setLoading(true);  // Set loading to true when fetching starts
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } })
            setData(response.data.data)
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);  // Set loading to false once data is fetched
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token])

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <div className="container">
                {loading ? ( // Display loader while data is fetching
                    <div className="loader">Loading orders...</div>
                ) : (
                    data.map((order, index) => {
                        return (
                            <div key={index} className='my-orders-order'>
                                <img src={assets.parcel_icon} alt='' />
                                <p>{order.items.map((item, index) => {
                                    if (index === order.items.length - 1) {
                                        return item.name + " x " + item.quantity + ", "
                                    } else {
                                        return item.name + " x " + item.quantity + ", "
                                    }
                                })}</p>
                                <p>₹{order.amount}.00</p>
                                <p>Items: {order.items.length}</p>
                                <p><span>&#x25cf;</span><b>{order.status}</b></p>
                                <button onClick={fetchOrders}>Track Order</button>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default MyOrders
