import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header"; // Imported but not used
import Sidebar from "../components/sidebar"; // Capitalized the filename for consistency

const Products = () => {
  return (
    <div className="min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
      <Navbar />
      <div className="flex">
        <Sidebar />
        {/* Main content placeholder */}
        <div className="flex-1 p-4">
          {/* Add your main content here */}
        </div>
      </div>
    </div>
  );
};

export default Products;
