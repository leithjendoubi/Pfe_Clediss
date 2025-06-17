import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import CartPage from "../pages/CartPage"; // Import your CartPage component
import trolleyIcon from "../assets/wired-outline-146-trolley-hover-jump.gif"; // Import your trolley icon

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);
  const [showCart, setShowCart] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const navItems = [
    { name: "My Profile", path: "/myprofil" },
    { name: "Support & Assistance", path: "/reclamation" },
    { name: "About", path: "/about" },
    { name: "Verify", action: sendVerificationOtp, condition: !userData?.isAccountVerified },
    { name: "Logout", action: logout }
  ];

  return (
    <>
      <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 bg-white border-b-2 border-red-500 z-50">
        <img 
          src={assets.elfirma} 
          alt="logo" 
          className="w-28 sm:w-32 cursor-pointer" 
          onClick={() => navigate("/Home1")}
        />

        <div className="flex items-center gap-6">
          {navItems.map((item, index) => {
            // Skip Verify button if condition isn't met
            if (item.condition === false) return null;
            
            return (
              <button
                key={index}
                onClick={() => item.action ? item.action() : navigate(item.path)}
                className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-l-4 hover:border-red-500"
              >
                {item.name}
              </button>
            );
          })}

          {/* Cart Button */}
          <button 
            onClick={toggleCart}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <img 
              src={trolleyIcon} 
              alt="Cart" 
              className="w-8 h-8" 
            />
            {/* Optional: Show cart item count */}
            {userData?.cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {userData.cartCount}
              </span>
            )}
          </button>

          {!userData && (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-l-4 hover:border-red-500"
            >
              Login <img src={assets.arrow_icon} alt="arrow_icon" />
            </button>
          )}
        </div>
      </div>

      {/* Cart Slide-out Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}
           style={{ marginTop: '80px' }}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button 
              onClick={toggleCart}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <CartPage />
        </div>
      </div>

      {/* Overlay when cart is open */}
      {showCart && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleCart}
        />
      )}
    </>
  );
};

export default Navbar;