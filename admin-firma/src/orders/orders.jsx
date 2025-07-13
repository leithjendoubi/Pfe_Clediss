import { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch all orders
        const ordersResponse = await axios.get('http://localhost:4000/api/order/get');
        setOrders(ordersResponse.data);

        // Extract all unique user IDs (customers and delivery persons)
        const allUserIds = new Set();
        ordersResponse.data.forEach(order => {
          allUserIds.add(order.userId); // Customer ID
          if (order.livreurId && order.livreurId !== 'waiting') {
            allUserIds.add(order.livreurId); // Delivery person ID
          }
        });

        // Fetch user data for all unique IDs
        const userDataPromises = Array.from(allUserIds).map(async userId => {
          try {
            const response = await axios.get(`http://localhost:4000/api/user/userdata/${userId}`);
            return {
              userId,
              name: response.data.userData?.name || 'Unknown User',
              image: response.data.userData?.image
            };
          } catch (error) {
            console.error(`Error fetching user data for ${userId}:`, error);
            return {
              userId,
              name: 'Unknown User',
              image: null
            };
          }
        });

        // Wait for all user data requests to complete
        const userDataResults = await Promise.all(userDataPromises);
        
        // Convert to a lookup object { userId: { name, image } }
        const userDataMap = {};
        userDataResults.forEach(user => {
          userDataMap[user.userId] = {
            name: user.name,
            image: user.image
          };
        });

        setUserData(userDataMap);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:4000/api/order/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getUserInfo = (userId) => {
    return userData[userId] || { name: 'Loading...', image: null };
  };

  const getDeliveryPersonInfo = (livreurId) => {
    if (!livreurId || livreurId === 'waiting') {
      return { name: 'Not assigned', image: null };
    }
    return userData[livreurId] || { name: 'Loading...', image: null };
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Delivery Person</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => {
              const customer = getUserInfo(order.userId);
              const deliveryPerson = getDeliveryPersonInfo(order.livreurId);
              
              return (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[120px]">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {customer.image && (
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <img className="h-10 w-10 rounded-full" src={customer.image} alt={customer.name} />
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc pl-5 space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} - {item.quantity} {item.size} (${item.price} each)
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    DT{order.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                    {order.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {deliveryPerson.image && (
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <img className="h-10 w-10 rounded-full" src={deliveryPerson.image} alt={deliveryPerson.name} />
                        </div>
                      )}
                      <div className="text-sm text-gray-500">{deliveryPerson.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'Confirmed and Prepared' ? 'bg-green-100 text-green-800' :
                        order.status === 'Order Placed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;