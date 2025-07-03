import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateProduct from "./pages/CreateProduct";
import Products from "./pages/Products";
import Marche from "./pages/Marche";
import Item from "./pages/Item";
import CartPage from "./pages/CartPage";
import AddOrder from "./pages/AddOrder";
import AddLivreur from "./pages/livraison/addlivreur";
import TreatDemand from "./pages/livraison/treatdemand";
import MarcheAdmin from "./admin/marches/MarcheAdmin";
import ShowMarchéAdmin from "./admin/marches/ShowMarchéAdmin";
import DemandProducteur from "./pages/demands/demandproducteur";
import DemandVendeur from "./pages/demands/demandevendeur";
import Home1 from "./pages/Home1";
import Map from "./pages/Map";
import MyProfil from "./pages/MyProfil";
import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";
import Market from "./pages/Market";

import ShowOrderToDeliver from "./pages/livraison/showordertodeliever";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  return (
    <div className="app-container">
      <ToastContainer />
      
      <main className="main-content">
        <Routes>
          <Route path="/CreateProduct" element={<CreateProduct/>} />
          <Route path='/product/:id' element={<Item/>} />
          <Route path='/addorder' element={<AddOrder/>}/>
          <Route path="/Home" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/showorder" element={<ShowOrderToDeliver />} />
          <Route path="/treatdemand" element={<TreatDemand/>}/>
          <Route path="/map" element={<Map/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/home1" element={<Home1 />} />
          <Route path="/myprofil" element={<MyProfil/>}/>
          <Route path="/" element={<Home1 />} />
          <Route path="/demandproducteur" element={<DemandProducteur />} />
          <Route path="/demandvendeur" element={<DemandVendeur />} />                 
          <Route path="/MarcheAdmin" element={<MarcheAdmin/>}/>
          <Route path="/showmarcheadmin" element={<ShowMarchéAdmin/>}/>        
          <Route path="/addlivreur" element={<AddLivreur/>}/>
          <Route path="/Marche" element={<Marche />} />        
          <Route path="/Products" element={<Products />} />
          <Route path="/CartPage" element={<CartPage />} />
          <Route path="/email-verify" element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;