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
        // جلب جميع الطلبات
        const ordersResponse = await axios.get('http://localhost:4000/api/order/get');
        setOrders(ordersResponse.data);

        // استخراج جميع معرّفات المستخدمين الفريدة (العملاء وموظفي التوصيل)
        const allUserIds = new Set();
        ordersResponse.data.forEach(order => {
          allUserIds.add(order.userId); // معرّف العميل
          if (order.livreurId && order.livreurId !== 'waiting') {
            allUserIds.add(order.livreurId); // معرّف موظف التوصيل
          }
        });

        // جلب بيانات المستخدم لجميع المعرّفات الفريدة
        const userDataPromises = Array.from(allUserIds).map(async userId => {
          try {
            const response = await axios.get(`http://localhost:4000/api/user/userdata/${userId}`);
            return {
              userId,
              name: response.data.userData?.name || 'مستخدم غير معروف',
              image: response.data.userData?.image
            };
          } catch (error) {
            console.error(`خطأ في جلب بيانات المستخدم لـ ${userId}:`, error);
            return {
              userId,
              name: 'مستخدم غير معروف',
              image: null
            };
          }
        });

        // انتظار اكتمال جميع طلبات بيانات المستخدم
        const userDataResults = await Promise.all(userDataPromises);
        
        // تحويل إلى كائن للبحث { userId: { name, image } }
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
      console.error('خطأ في حذف الطلب:', err);
      alert('فشل في حذف الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getUserInfo = (userId) => {
    return userData[userId] || { name: 'جاري التحميل...', image: null };
  };

  const getDeliveryPersonInfo = (livreurId) => {
    if (!livreurId || livreurId === 'waiting') {
      return { name: 'غير معيّن', image: null };
    }
    return userData[livreurId] || { name: 'جاري التحميل...', image: null };
  };

  if (loading) return <div className="text-center py-8">جاري تحميل الطلبات...</div>;
  if (error) return <div className="text-center py-8 text-red-500">خطأ: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">جميع الطلبات</h1>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">معرف الطلب</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">العميل</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">المنتجات</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">المجموع</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">العنوان</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">موظف التوصيل</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">الحالة</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">التاريخ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">إجراءات</th>
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
                          {item.name} - {item.quantity} {item.size} (د.ت {item.price} لكل واحد)
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    د.ت{order.amount}
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
                      {order.status === 'Confirmed and Prepared' ? 'تم التأكيد والتجهيز' :
                       order.status === 'Order Placed' ? 'تم وضع الطلب' :
                       order.status}
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
                      حذف
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