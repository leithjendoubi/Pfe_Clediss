import { useState } from 'react';
import LoginAdmin from './auth/login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdministrationDashboard from './administration/administration';
import MarcheAdmin from './marches/MarcheAdmin';
import ShowMarchéAdmin from './marches/ShowMarchéAdmin';
import TreatDemand from './livraison/treatdemand';
import ProducteurVendeur from './administration/treatdemandusers'

import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAdmin />} />
        <Route path="/administration" element={<AdministrationDashboard />} />
        <Route path="/marche" element={<ShowMarchéAdmin />} />  
        <Route path="/livreurDemand" element={<TreatDemand />} />
        <Route path="/demandofusers" element={<ProducteurVendeur />} />        
      </Routes>
    </Router>
  );
}

export default App;
