import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProducteurVendeur = () => {
  const [producteurDemands, setProducteurDemands] = useState([]);
  const [acceptedProducteurDemands, setAcceptedProducteurDemands] = useState([]);
  const [vendeurDemands, setVendeurDemands] = useState([]);
  const [acceptedVendeurDemands, setAcceptedVendeurDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch producteur demands
  const fetchProducteurDemands = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/producteur/demands');
      setProducteurDemands(response.data);
    } catch (err) {
      setError('Failed to fetch producteur demands');
    }
  };

  // Fetch accepted producteur demands
  const fetchAcceptedProducteurDemands = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/producteur/demandsaccepted');
      setAcceptedProducteurDemands(response.data);
    } catch (err) {
      setError('Failed to fetch accepted producteur demands');
    }
  };

  // Fetch vendeur demands
  const fetchVendeurDemands = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/vendeur/demands');
      setVendeurDemands(response.data);
    } catch (err) {
      setError('Failed to fetch vendeur demands');
    }
  };

  // Fetch accepted vendeur demands
  const fetchAcceptedVendeurDemands = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/vendeur/demandsaccepted');
      setAcceptedVendeurDemands(response.data);
    } catch (err) {
      setError('Failed to fetch accepted vendeur demands');
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProducteurDemands(),
        fetchAcceptedProducteurDemands(),
        fetchVendeurDemands(),
        fetchAcceptedVendeurDemands(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handle accept producteur demand
  const handleAcceptProducteur = async (producteurId) => {
    try {
      await axios.put(`http://localhost:4000/api/producteur/${producteurId}/accept-demande`);
      await fetchProducteurDemands();
      await fetchAcceptedProducteurDemands();
    } catch (err) {
      setError('Failed to accept producteur demand');
    }
  };

  // Handle refuse producteur demand
  const handleRefuseProducteur = async (producteurId) => {
    try {
      await axios.put(`http://localhost:4000/api/producteur/${producteurId}/refuse-demande`);
      await fetchProducteurDemands();
    } catch (err) {
      setError('Failed to refuse producteur demand');
    }
  };

  // Handle stop producteur demand
  const handleStopProducteur = async (producteurId) => {
    try {
      await axios.put(`http://localhost:4000/api/producteur/${producteurId}/stop`);
      await fetchAcceptedProducteurDemands();
    } catch (err) {
      setError('Failed to stop producteur demand');
    }
  };

  // Handle delete producteur demand
  const handleDeleteProducteur = async (producteurId) => {
    if (window.confirm('Are you sure you want to delete this producteur demand?')) {
      try {
        await axios.delete(`http://localhost:4000/api/producteur/${producteurId}`);
        await fetchAcceptedProducteurDemands();
      } catch (err) {
        setError('Failed to delete producteur demand');
      }
    }
  };

  // Handle accept vendeur demand
  const handleAcceptVendeur = async (vendeurId) => {
    try {
      await axios.put(`http://localhost:4000/api/vendeur/accept/${vendeurId}`);
      await fetchVendeurDemands();
      await fetchAcceptedVendeurDemands();
    } catch (err) {
      setError('Failed to accept vendeur demand');
    }
  };

  // Handle refuse vendeur demand
  const handleRefuseVendeur = async (vendeurId) => {
    try {
      await axios.put(`http://localhost:4000/api/vendeur/refuse/${vendeurId}`);
      await fetchVendeurDemands();
    } catch (err) {
      setError('Failed to refuse vendeur demand');
    }
  };

  // Handle stop vendeur demand
  const handleStopVendeur = async (vendeurId) => {
    try {
      await axios.put(`http://localhost:4000/api/vendeur/${vendeurId}/stop`);
      await fetchAcceptedVendeurDemands();
    } catch (err) {
      setError('Failed to stop vendeur demand');
    }
  };

  // Handle delete vendeur demand
  const handleDeleteVendeur = async (vendeurId) => {
    if (window.confirm('Are you sure you want to delete this vendeur demand?')) {
      try {
        await axios.delete(`http://localhost:4000/api/vendeur/${vendeurId}`);
        await fetchAcceptedVendeurDemands();
      } catch (err) {
        setError('Failed to delete vendeur demand');
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Section 1: Pending Producteur Demands */}
      <h2 className="text-2xl font-bold mb-4">Pending Producteur Demands</h2>
      <div className="grid gap-4">
        {producteurDemands.map((demand) => (
          <div key={demand._id} className="border p-4 rounded-lg shadow">
            <p><strong>Name:</strong> {demand.nometprenomlegal}</p>
            <p><strong>Phone:</strong> {demand.numeroPhone}</p>
            <p><strong>Address:</strong> {demand.adressProfessionnel}</p>
            <p><strong>Storage Address:</strong> {demand.adressDeStockage}</p>
            <p><strong>Category:</strong> {demand.categorieProduitMarche.join(', ')}</p>
            <p><strong>Type:</strong> {demand.typeDesProducteurs}</p>
            <p><strong>Status:</strong> {demand.statutdemande}</p>
            <div className="mt-2">
              <button
                onClick={() => handleAcceptProducteur(demand._id)}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleRefuseProducteur(demand._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Refuse
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Section 2: Accepted Producteur Demands */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Accepted Producteur Demands</h2>
      <div className="grid gap-4">
        {acceptedProducteurDemands.map((demand) => (
          <div key={demand._id} className="border p-4 rounded-lg shadow">
            <p><strong>Name:</strong> {demand.nometprenomlegal}</p>
            <p><strong>Phone:</strong> {demand.numeroPhone}</p>
            <p><strong>Address:</strong> {demand.adressProfessionnel}</p>
            <p><strong>Storage Address:</strong> {demand.adressDeStockage}</p>
            <p><strong>Category:</strong> {demand.categorieProduitMarche.join(', ')}</p>
            <p><strong>Type:</strong> {demand.typeDesProducteurs}</p>
            <p><strong>Status:</strong> {demand.statutdemande}</p>
            <div className="mt-2">
              <button
                onClick={() => handleStopProducteur(demand._id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-600"
              >
                Stop
              </button>
              <button
                onClick={() => handleDeleteProducteur(demand._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Section 3: Pending Vendeur Demands */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Pending Vendeur Demands</h2>
      <div className="grid gap-4">
        {vendeurDemands.map((demand) => (
          <div key={demand._id} className="border p-4 rounded-lg shadow">
            <p><strong>Name:</strong> {demand.nometprenomlegal}</p>
            <p><strong>Phone:</strong> {demand.numeroPhone}</p>
            <p><strong>Address:</strong> {demand.adressProfessionnel}</p>
            <p><strong>Storage Address:</strong> {demand.adressDeStockage}</p>
            <p><strong>Category:</strong> {demand.categorieProduitMarche.join(', ')}</p>
            <p><strong>Type:</strong> {demand.typeDesProducteurs}</p>
            <p><strong>Status:</strong> {demand.statutdemande}</p>
            <div className="mt-2">
              <button
                onClick={() => handleAcceptVendeur(demand._id)}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleRefuseVendeur(demand._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Refuse
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Section 4: Accepted Vendeur Demands */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Accepted Vendeur Demands</h2>
      <div className="grid gap-4">
        {acceptedVendeurDemands.map((demand) => (
          <div key={demand._id} className="border p-4 rounded-lg shadow">
            <p><strong>Name:</strong> {demand.nometprenomlegal}</p>
            <p><strong>Phone:</strong> {demand.numeroPhone}</p>
            <p><strong>Address:</strong> {demand.adressProfessionnel}</p>
            <p><strong>Storage Address:</strong> {demand.adressDeStockage}</p>
            <p><strong>Category:</strong> {demand.categorieProduitMarche.join(', ')}</p>
            <p><strong>Type:</strong> {demand.typeDesProducteurs}</p>
            <p><strong>Status:</strong> {demand.statutdemande}</p>
            <div className="mt-2">
              <button
                onClick={() => handleStopVendeur(demand._id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-600"
              >
                Stop
              </button>
              <button
                onClick={() => handleDeleteVendeur(demand._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProducteurVendeur;