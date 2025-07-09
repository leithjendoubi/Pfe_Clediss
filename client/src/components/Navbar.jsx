//
import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import CartPage from "../pages/products/CartPage";
import trolleyIcon from "../assets/wired-outline-146-trolley-hover-jump.gif";
import toDelieverIcon from "../assets/todeliever.png"; // Add this import

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);
  const [showCart, setShowCart] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp");
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
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const navItems = [
    { name: "Acceuil", path: "/Home" },   
    { name: "My Profile", path: "/myprofil" },
    { name: "Support", path: "/Home" },
    { name: "About", path: "/Home" },
    
    { name: "Verify", action: sendVerificationOtp, condition: !userData?.isAccountVerified },
    { name: "Logout", action: logout },
  ];

  return (
    <>
      <nav className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 fixed top-0 bg-white/80 backdrop-blur-md border-b border-blue-100 z-50 transition-all duration-300">
        <img
          src={assets.elfirma}
          alt="logo"
          className="w-28 sm:w-32 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate("/Home")}
        />

        <div className="flex items-center gap-4 sm:gap-6">
          {navItems.map((item, index) => {
            if (item.condition === false) return null;
            return (
              <button
                key={index}
                onClick={() => (item.action ? item.action() : navigate(item.path))}
                className="px-3 py-2 text-blue-700 hover:text-blue-900 font-medium rounded-lg transition-all duration-300 hover:bg-blue-50/50"
              >
                {item.name}
              </button>
            );
          })}

          {/* Add the toDeliever icon button */}
          <button
            onClick={() => navigate("/todeliver")}
            className="p-2 rounded-full hover:bg-blue-50/50 transition-all duration-300"
          >
            <img src={toDelieverIcon} alt="To Deliever" className="w-7 h-7" />
          </button>

          <button
            onClick={toggleCart}
            className="relative p-2 rounded-full hover:bg-blue-50/50 transition-all duration-300"
          >
            <img src={trolleyIcon} alt="Cart" className="w-7 h-7" />
            {userData?.cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {userData.cartCount}
              </span>
            )}
          </button>

          {!userData && (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-4 py-2 text-blue-700 font-medium rounded-lg hover:bg-blue-50/50 transition-all duration-300"
            >
              Login <img src={assets.arrow_icon} alt="arrow" className="w-4 h-4" />
            </button>
          )}
        </div>
      </nav>

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-500 ease-in-out z-40 ${
          showCart ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ marginTop: "80px" }}
      >
        <div className="p-5 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={toggleCart}
              className="text-blue-500 hover:text-blue-700 text-xl font-bold transition-colors"
            >
              ✕
            </button>
          </div>
          <CartPage />
        </div>
      </div>

      {showCart && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-300 transition-opacity duration-300"
          onClick={toggleCart}
        />
      )}
    </>
  );
};

export default Navbar;