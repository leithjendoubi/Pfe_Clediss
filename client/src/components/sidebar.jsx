import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext } from 'react';
import { AppContext } from "../context/AppContext";


const Sidebar = () => {
  const navigate = useNavigate();
const { userData } = useContext(AppContext);

  const menuItems = [
    { name: "Mes Activités", path: "/activity", icon: assets.activities_icon },
    { name: "Notification", path: "/notification", icon: assets.notification_icon },
    { name: "Marché", path: "/Marche", icon: assets.marche_icon },
    { name: "Maps", path: "/map", icon: assets.maps_icon },
    { name: "Livraison", path: "/livraison", icon: assets.livraison_icon },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r-2 border-blue-500 fixed left-0 top-0 flex flex-col">
      {/* Empty div to push content to center */}
      <div className="flex-grow"></div>
      
      <div className="p-4 flex flex-col items-center justify-center">
        <ul className="space-y-6 w-full">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                            onClick={() => {
                              navigate(item.path);
                              console.log(userData.name);
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