import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const AddOrder = () => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    numeroPhone: '00216',
    address: '',
    typeLivraison: '',
    centrePickup: '',
    paymentMethod: '',
  });
    const openMapDialog = () => {
    setIsMapOpen(true);
  };

  const closeMapDialog = () => {
    setIsMapOpen(false);
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartResponse = await axios.post(
          'http://localhost:4000/api/cart/get',
          { userId: userData.userId },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        const cartData = cartResponse.data.cartData;
        setCartItems(cartData);

        const productIds = Object.keys(cartData);
        const productPromises = productIds.map(async (productId) => {
          try {
            const response = await axios.get(`http://localhost:4000/api/product/${productId}`);
            return response.data.product;
          } catch (err) {
            console.error(`Error fetching product ${productId}:`, err);
            return null;
          }
        });

        const productResults = await Promise.all(productPromises);
        const productsData = {};
        productResults.forEach((product, index) => {
          if (product) {
            productsData[productIds[index]] = product;
          }
        });

        setProducts(productsData);

        let calculatedTotal = 0;
        Object.entries(cartData).forEach(([productId, sizes]) => {
          Object.entries(sizes).forEach(([size, quantity]) => {
            if (productsData[productId]) {
              calculatedTotal += productsData[productId].price * quantity;
            }
          });
        });
        setTotal(calculatedTotal.toFixed(2));

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (userData) {
      fetchCartData();
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('00216')) {
      value = '00216' + value.replace(/^00216/, '');
    }
    setFormData(prev => ({ ...prev, numeroPhone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const items = Object.entries(cartItems).map(([productId, sizes]) => {
        return Object.entries(sizes).map(([size, quantity]) => ({
          productId,
          name: products[productId]?.name || 'Unknown Product',
          price: products[productId]?.price || 0,
          size,
          quantity
        }));
      }).flat();

      const orderData = {
        userId: userData.userId,
        numeroPhone: formData.numeroPhone,
        items,
        amount: total,
        address: formData.typeLivraison === 'centre pickup' 
          ? `Centre de pickup: ${formData.centrePickup}`
          : formData.address,
        typeLivraison: formData.typeLivraison,
        paymentMethod: formData.paymentMethod,
      };

      const response = await axios.post(
        'http://localhost:4000/api/order/add',
        orderData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.data.success) {
        await axios.post(
          'http://localhost:4000/api/cart/delete-cart',
          { userId: userData.userId },
        );
        console.log("hiiiiii")
        navigate(`/marche`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Passer une Commande</h1>
      
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Résumé de la Commande</h2>
        {Object.keys(cartItems).length === 0 ? (
          <p className="text-gray-500">Votre panier est vide</p>
        ) : (
          <>
            {Object.entries(cartItems).map(([productId, sizes]) => (
              <div key={productId} className="mb-6 pb-6 border-b last:border-b-0">
                <div className="flex items-start gap-4">
                  <img 
                    src={products[productId]?.image[0]?.url || ''} 
                    alt={products[productId]?.name} 
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{products[productId]?.name}</h3>
                    <div className="mt-2 space-y-2">
                      {Object.entries(sizes).map(([size, quantity]) => (
                        <div key={size} className="flex justify-between text-sm">
                          <span>
                            {size}: {quantity} × {products[productId]?.price} DT
                          </span>
                          <span className="font-medium">
                            {(products[productId]?.price * quantity).toFixed(2)} DT
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-4 border-t font-bold text-lg">
              <span>Total:</span>
              <span>{total} DT</span>
            </div>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Informations de Livraison</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="numeroPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de Téléphone
            </label>
            <input
              type="tel"
              id="numeroPhone"
              name="numeroPhone"
              value={formData.numeroPhone}
              onChange={handlePhoneChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              pattern="00216[0-9]{8}"
              maxLength="13"
            />
            <p className="mt-1 text-xs text-gray-500">Format: 00216XXXXXXXX</p>
          </div>

          <div>
            <label htmlFor="typeLivraison" className="block text-sm font-medium text-gray-700 mb-1">
              Type de Livraison
            </label>
            <select
              id="typeLivraison"
              name="typeLivraison"
              value={formData.typeLivraison}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Sélectionnez une option</option>
              <option value="par toi meme">Par toi-même</option>
              <option value="centre pickup">Centre de pickup</option>
              <option value="attendez une livraison">Attendez une livraison</option>
              <option value="par firma">Par Firma</option>
            </select>
          </div>

          {formData.typeLivraison === 'centre pickup' && (
            <div>
              <label htmlFor="centrePickup" className="block text-sm font-medium text-gray-700 mb-1">
                Centre de Pickup
              </label>
              <select
                id="centrePickup"
                name="centrePickup"
                value={formData.centrePickup}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Sélectionnez un centre</option>
                <option value="bizerte">Bizerte</option>
                <option value="tunis">Tunis</option>
                <option value="nabeul">Nabeul</option>
                <option value="ariana">Ariana</option>
                <option value="mateur">Mateur</option>
              </select>
            </div>
          )}

          {formData.typeLivraison !== 'centre pickup' && (
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse de Livraison
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                required={formData.typeLivraison !== 'centre pickup'}
              />
            </div>
          )}

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
              Méthode de Paiement
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Sélectionnez une option</option>
              <option value="à livraison">À livraison</option>
              <option value="en ligne">En ligne</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={Object.keys(cartItems).length === 0 || isSubmitting}
          className={`w-full mt-6 py-3 px-4 rounded-md font-medium ${
            Object.keys(cartItems).length === 0 || isSubmitting
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? 'Processing...' : 'Confirmer la Commande'}
        </button>

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default AddOrder;