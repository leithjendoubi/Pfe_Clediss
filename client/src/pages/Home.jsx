import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Sidebar from "../components/sidebar";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
     <Sidebar/>
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
