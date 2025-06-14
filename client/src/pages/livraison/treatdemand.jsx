import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TreatDemand = () => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptModal, setAcceptModal] = useState(false);
  const [currentLivreur, setCurrentLivreur] = useState(null);
  const [formData, setFormData] = useState({
    citeprincipale: '',
    VolumeDisponibleParDefaut: '',
    poidsMaximale: ''
  });

  // Fetch all pending demands
  const fetchDemands = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/livreur/demande');
      setDemands(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch demands');
      console.error('Error fetching demands:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemands();
  }, []);

  // Handle accept modal open
  const openAcceptModal = (livreur) => {
    setCurrentLivreur(livreur);
    setAcceptModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Accept a demande
  const handleAccept = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/livreur/accept`,
        {
          ...formData,
          livreurId: currentLivreur._id
        }
      );
      
      toast.success('Demand accepted successfully');
      setAcceptModal(false);
      fetchDemands(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept demand');
      console.error('Error accepting demand:', error);
    }
  };

  // Reject a demande
  const handleReject = async (livreurId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/livreur/reject`,
        { livreurId }
      );
      
      toast.success('Demand rejected successfully');
      fetchDemands(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject demand');
      console.error('Error rejecting demand:', error);
    }
  };

  // View documents
  const viewDocuments = (documents) => {
    return (
      <div className="space-y-2">
        {documents.map((doc, index) => (
          <a 
            key={index} 
            href={doc} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline block"
          >
            Document {index + 1}
          </a>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Livreur Demands</h1>
      
      {demands.length === 0 ? (
        <p className="text-gray-600">No pending demands found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">User ID</th>
                <th className="py-3 px-4 text-left">Telephone</th>
                <th className="py-3 px-4 text-left">Documents</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {demands.map((demand) => (
                <tr key={demand._id}>
                  <td className="py-3 px-4">{demand.userId}</td>
                  <td className="py-3 px-4">{demand.telephone}</td>
                  <td className="py-3 px-4">{viewDocuments(demand.documents)}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => openAcceptModal(demand)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(demand._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Accept Modal */}
      {acceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Accept Livreur</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cité Principale</label>
                <input
                  type="text"
                  name="citeprincipale"
                  value={formData.citeprincipale}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Volume Disponible</label>
                <input
                  type="number"
                  name="VolumeDisponibleParDefaut"
                  value={formData.VolumeDisponibleParDefaut}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Poids Maximale</label>
                <input
                  type="number"
                  name="poidsMaximale"
                  value={formData.poidsMaximale}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setAcceptModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatDemand;