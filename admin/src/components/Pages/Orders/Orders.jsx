import React, { useState, useEffect } from 'react'
import './Orders.css'
import { toast } from 'react-toastify'
import axios from "axios"
import { assets } from '../../../assets/assets'

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllOrders = async () => {
    setLoading(true)
    try {
      const response = await axios.get(url + "/api/order/list")
      if (response.data.success) {
        setOrders(response.data.data)
        console.log(response.data.data)
      } else {
        toast.error("Error")
      }
    } catch (error) {
      toast.error("Error fetching orders")
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders()
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  if (loading) {
    return <div className='loading-container'><div className='loader'></div></div>
  }

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className='order-list'>
        {orders.slice().reverse().map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div className='order-item-details'>
              <p className='order-item-food'>
                {order.items.map((item, length) => {
                  if (length === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  } else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className='order-item-address'>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + "," + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <div className='order-item-footer'>
              <div className='item-count'>
                <p>Item: {order.items.length}</p>
              </div>
              <div className='amount'>
                <p>₹{order.amount}</p>
              </div>
              <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className='order-item-status'>
              <span className={order.status.replace(/ /g, '-').toLowerCase()}>{order.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
