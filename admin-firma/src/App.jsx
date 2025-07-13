import { useState } from 'react';
import LoginAdmin from './auth/login';
import AdministrationDashboard from './administration/administration';
import ShowMarchéAdmin from './marches/ShowMarchéAdmin';
import TreatDemand from './livraison/treatdemand';
import ProducteurVendeur from './administration/treatdemandusers';
import TreatProducts from './Products/treatproduct';
import Orders from './orders/orders'
import { Routes, Route } from "react-router-dom";
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<LoginAdmin />} />
      <Route path="/administration" element={<AdministrationDashboard />} />
      <Route path="/marche" element={<ShowMarchéAdmin />} />  
      <Route path="/livreurDemand" element={<TreatDemand />} />
      <Route path="/demandofusers" element={<ProducteurVendeur />} />   
      <Route path="/treatproducts" element={<TreatProducts />} />
      <Route path="/orders" element={<Orders />} />

    </Routes>
  );
}

export default App;