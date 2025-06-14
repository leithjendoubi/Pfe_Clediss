import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const CartPage = () => {
  const { userData, getUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // 1. Get cart data
        const cartResponse = await axios.post(
          'http://localhost:4000/api/cart/get',
          { userId: userData.userId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const cartData = cartResponse.data.cartData;
        setCartItems(cartData);

        // 2. Get product details for each item in cart
        const productIds = Object.keys(cartData);
        const productPromises = productIds.map(async (productId) => {
          try {
            const response = await axios.get(`http://localhost:4000/api/product/${productId}`);
            return response.data.product;
          } catch (err) {
            console.error(`Failed to fetch product ${productId}:`, err);
            return null;
          }
        });

        const productResults = await Promise.all(productPromises);
        const productMap = {};
        productResults.forEach((product, index) => {
          if (product) {
            productMap[productIds[index]] = product;
          }
        });

        setProducts(productMap);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError(error.response?.data?.message || 'Failed to load cart');
        setLoading(false);
      }
    };

    if (userData) {
      fetchCart();
    }
  }, [userData, navigate]);

  const calculateTotal = () => {
    let total = 0;
    Object.entries(cartItems).forEach(([productId, sizes]) => {
      Object.entries(sizes).forEach(([size, quantity]) => {
        if (products[productId]) {
          total += products[productId].price * quantity;
        }
      });
    });
    return total.toFixed(2);
  };

  const handleDeleteItem = async (productId, size) => {
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/cart/delete',
        {
          userId: userData.userId,
          itemId: productId,
          size: size,
          removeCompletely: true
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        // Update local state to reflect the deletion without refetching
        const updatedCartItems = { ...cartItems };
        
        // Remove the size from the product
        delete updatedCartItems[productId][size];
        
        // If no sizes left for this product, remove the product entirely
        if (Object.keys(updatedCartItems[productId]).length === 0) {
          delete updatedCartItems[productId];
        }

        setCartItems(updatedCartItems);
        
        // Optional: Refetch cart data to ensure sync with server
        // getUserData();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(error.response?.data?.message || 'Failed to remove item from cart');
    }
  };

  if (loading) return <div className="text-center py-8">Loading cart...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {Object.keys(cartItems).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {Object.entries(cartItems).map(([productId, sizes]) => {
              const product = products[productId];
              if (!product) return null;

              return (
                <div key={productId} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <img
                        src={product.image[0].url}
                        alt={product.name}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                        <span className="text-lg font-semibold">DT {product.price}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{product.description}</p>
                      
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">Sizes and Quantities:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.entries(sizes).map(([size, quantity]) => (
                            <div 
                              key={`${productId}-${size}`} 
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-md relative"
                            >
                              <div className="flex items-center gap-4">
                                <span className="font-medium">Size: {size}</span>
                                <span className="text-gray-600">Qty: {quantity}</span>
                                <span className="font-semibold">
                                  DT {(product.price * quantity).toFixed(2)}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteItem(productId, size)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                                title="Remove from cart"
                              >
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  className="h-5 w-5" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M6 18L18 6M6 6l12 12" 
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Total:</h3>
              <span className="text-2xl font-bold">DT {calculateTotal()}</span>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/addorder')}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;