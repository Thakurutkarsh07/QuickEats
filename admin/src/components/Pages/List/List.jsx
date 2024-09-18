import React, { useEffect, useState } from 'react';
import './List.css';
import { toast } from 'react-toastify';
import axios from 'axios';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching list");
      }
    } catch (error) {
      toast.error("Error fetching list");
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success("Food removed");
        fetchList(); // Fetch the list again after removal
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      toast.error("Error removing food");
    }
  };

  useEffect(() => {
    fetchList();
  }, [url]);

  if (loading) {
    return <div className='loader'></div>; // Show loader while data is being fetched
  }

  return (
    <div className='list'>
      <p className='list-title'>All Food List</p>
      <div className='list-table'>
        <div className="list-table-header">
          <div className="cell">Image</div>
          <div className="cell">Name</div>
          <div className="cell">Category</div>
          <div className="cell">Price</div>
          <div className="cell">Action</div>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-row">
            <div className="cell">
              <img src={`${url}/images/${item.image}`} alt={item.name} />
            </div>
            <div className="cell">{item.name}</div>
            <div className="cell">{item.category}</div>
            <div className="cell">₹{item.price}</div>
            <div className="cell">
              <span onClick={() => removeFood(item._id)} className='cursor'>X</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
