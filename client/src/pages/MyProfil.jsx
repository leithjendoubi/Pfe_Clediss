import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import AddLivreur from '../pages/livraison/addlivreur';
import DemandProducteur from '../pages/demands/demandproducteur';
import DemandVendeur from '../pages/demands/demandevendeur';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Map from './Map';

const MyProfil = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showLivreurDialog, setShowLivreurDialog] = useState(false);
  const [showProducteurDialog, setShowProducteurDialog] = useState(false);
  const [showVendeurDialog, setShowVendeurDialog] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/order/user/${userData.userId}`);
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (userData?.userId) {
      fetchOrders();
    }
  }, [userData?.userId]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `http://localhost:4000/api/auth/${userData.userId}/photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUserData({
        ...userData,
        image: response.data.imageUrl
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (roleType) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/auth/change-role`, {
        userId: userData.userId,
        roleType
      });

      setUserData({
        ...userData,
        isLivreur: response.data.isLivreur,
        isVendeur: response.data.isVendeur,
        isProducteur: response.data.isProducteur
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change role');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowLivreurDialog(false);
      setShowProducteurDialog(false);
      setShowVendeurDialog(false);
    }
  };

  const openMapDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setIsMapOpen(true);
  };

  const closeMapDialog = () => {
    setIsMapOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <div className="container mx-auto p-4 relative flex flex-col items-center justify-center min-h-screen bg-[url('/bg1.jpg')] bg-cover bg-center">
      <h1 className="text-2xl font-bold mb-6 text-white">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              {userData.image ? (
                <img
                  src={userData.image}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No photo</span>
                </div>
              )}
            </div>

            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              {loading ? 'Uploading...' : 'Change Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={loading}
              />
            </label>

            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG (Max 5MB)
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Current Status:</h3>
            <div className="flex flex-wrap gap-2">
              {userData.isLivreur && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Delivery Person
                </span>
              )}
              {userData.isVendeur && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Seller
                </span>
              )}
              {userData.isProducteur && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Producer
                </span>
              )}
              {!userData.isLivreur && !userData.isVendeur && !userData.isProducteur && (
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  Client
                </span>
              )}
            </div>
          </div>

          {!(userData.isLivreur || userData.isVendeur || userData.isProducteur) ? (
            <div className="space-y-3 mb-6">
              <h3 className="font-medium">Become a:</h3>
              <button
                onClick={() => setShowLivreurDialog(true)}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                Delivery Person
              </button>
              <button
                onClick={() => setShowProducteurDialog(true)}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                Producer
              </button>
              <button
                onClick={() => setShowVendeurDialog(true)}
                className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
              >
                Seller
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleRoleChange('client')}
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition mb-6"
            >
              Return to Client Status
            </button>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <p className="p-2 bg-gray-50 rounded">{userData?.name || 'Not available'}</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <p className="p-2 bg-gray-50 rounded">{userData?.email || 'Not available'}</p>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
              Photo updated successfully!
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">My Orders</h2>

          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Order #{order._id.substring(0, 8)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      order.status === 'Order Placed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between py-2 border-b">
                        <div>
                          <p>{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x {item.price} DT ({item.size})
                          </p>
                        </div>
                        <p>{item.quantity * item.price} DT</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between border-t pt-2">
                    <div>
                      <p className="text-sm">Delivery: {order.typeLivraison}</p>
                      <p className="text-sm">Payment: {order.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Total: {order.amount + order.amount_livraison} DT</p>
                      <p className="text-sm text-gray-500">(Products: {order.amount} DT)</p>
                      {order.amount_livraison > 0 && (
                        <p className="text-sm text-gray-500">(Delivery: {order.amount_livraison} DT)</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => openMapDialog(order._id)}
                    >
                      Add Address
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isMapOpen} onClose={closeMapDialog} maxWidth="md" fullWidth>
        <DialogTitle>Select Address on Map</DialogTitle>
        <DialogContent>
          <Map orderId={selectedOrderId} />
        </DialogContent>
      </Dialog>

      {(showLivreurDialog || showProducteurDialog || showVendeurDialog) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {showLivreurDialog && (
              <AddLivreur
                userId={userData.userId}
                onClose={() => setShowLivreurDialog(false)}
                onSuccess={() => {
                  setShowLivreurDialog(false);
                  handleRoleChange('livreur');
                }}
              />
            )}

            {showProducteurDialog && (
              <DemandProducteur
                userId={userData.userId}
                onClose={() => setShowProducteurDialog(false)}
                onSuccess={() => {
                  setShowProducteurDialog(false);
                  handleRoleChange('producteur');
                }}
              />
            )}

            {showVendeurDialog && (
              <DemandVendeur
                userId={userData.userId}
                onClose={() => setShowVendeurDialog(false)}
                onSuccess={() => {
                  setShowVendeurDialog(false);
                  handleRoleChange('vendeur');
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfil;