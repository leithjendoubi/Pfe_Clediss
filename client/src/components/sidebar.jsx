import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext } from 'react';
import { AppContext } from "../context/AppContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [isVisible, setIsVisible] = useState(false);

  const menuItems = [
    { name: "Products", path: "/Marche", icon: assets.product },
    { name: "Marché des producteurs", path: "/allproducts", icon: assets.marche_icon },
    { name: "Marché Réglémenté", path: "/Market", icon: assets.marche_icon },
    { name: "My Stocks", path: "/Stockeur", icon: assets.stockicon },     
    { name: "Maps", path: "/map", icon: assets.maps_icon },
    { name: "find livreur", path: "/livreurs", icon: assets.livreuricon },
    { name: "Order to deliever", path: "/showorder", icon: assets.livraison_icon },
    { name: "Mandat", path: "/venderlist", icon: assets.mandat },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Show sidebar if mouse is within 50 pixels of left edge
      if (e.clientX <= 50) {
        setIsVisible(true);
      } else if (e.clientX > 250) { // Hide when mouse moves beyond sidebar width
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className={`flex h-screen w-64 bg-white border-r-2 border-blue-500 fixed top-0 flex-col transition-all duration-300 ease-in-out ${
        isVisible ? 'left-0' : '-left-64'
      }`}
    >
      {/* Empty div to push content to center */}
      <div className="flex-grow"></div>
      
      <div className="p-4 flex flex-col items-center justify-center">
        <ul className="space-y-6 w-full">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  navigate(item.path);
                  console.log(userData.userId);
                }}
                className="flex items-center justify-center w-full p-3 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 hover:border-l-4 hover:border-blue-500"
              >
                <img src={item.icon} alt={item.name} className="w-6 h-6 mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Empty div to push content to center */}
      <div className="flex-grow"></div>
    </div>
  );
};

export default Sidebar;