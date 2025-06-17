import { useState } from 'react';
import LoginAdmin from './auth/login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
