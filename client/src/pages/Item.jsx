
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Item = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, getUserData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isInCart, setIsInCart] = useState(false);
  const [currentCartQuantity, setCurrentCartQuantity] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/product/${id}`);
        setProduct(response.data.product);
        if (response.data.product.sizes.length > 0) {
          setSelectedSize(response.data.product.sizes[0]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Check if item is already in cart when userData or product changes
    if (userData && product) {
      const cartItem = userData.cartData?.[product._id]?.[selectedSize];
      setIsInCart(!!cartItem);
      setCurrentCartQuantity(cartItem || 0);
    }
  }, [userData, product, selectedSize]);

  const handleAddToCart = async () => {
    if (!userData) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/cart/add',
        {
          userId: userData.userId,
          itemId: product._id,
          size: selectedSize,
          quantity: quantity // Send the selected quantity to backend
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        alert(`${product.name} (Size: ${selectedSize}, Qty: ${quantity}) added to cart!`);
        getUserData(); // Refresh user data to update cart
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const handleUpdateCart = async () => {
    try {
      const response = await axios.put(
        'http://localhost:4000/api/cart/update',
        {
          userId: userData.userId,
          itemId: product._id,
          size: selectedSize,
          quantity: quantity
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        alert(`Cart updated: ${product.name} (Size: ${selectedSize}) quantity set to ${quantity}`);
        getUserData(); // Refresh user data
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      alert(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        ← Back to Products
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img 
              src={product.image[0].url} 
              alt={product.name} 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="mb-4">
            <span className="text-2xl font-semibold text-gray-800">DT {product.price}</span>
            {product.bestseller && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Bestseller
              </span>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <p className="text-gray-500">Subcategory</p>
                <p className="font-medium">{product.subCategory}</p>
              </div>
              <div>
                <p className="text-gray-500">Available Sizes</p>
                <div className="flex gap-2 mt-1">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 border rounded-md ${
                        selectedSize === size 
                          ? 'bg-blue-100 border-blue-500' 
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              {isInCart && (
                <div>
                  <p className="text-gray-500">Currently in Cart</p>
                  <p className="font-medium">{currentCartQuantity} items</p>
                </div>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Quantity</h2>
            <div className="flex items-center">
              <button 
                onClick={decreaseQuantity}
                className="px-3 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300"
              >
                -
              </button>
              <span className="px-4 py-1 bg-gray-100">{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className="px-3 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!isInCart ? (
              <button 
                onClick={handleAddToCart}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!selectedSize}
              >
                Add to Cart
              </button>
            ) : (
              <button 
                onClick={handleUpdateCart}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Update Quantity ({currentCartQuantity} → {quantity})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;