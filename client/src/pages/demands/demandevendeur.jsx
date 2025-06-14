import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

const DOCUMENT_TYPES = {
  BUSINESS_LICENSE: "Business License",
  ID_CARD_COPY: "ID Card Copy",
  TAX_REGISTRATION: "Tax Registration",
  POULTRY_TRADE_PERMIT: "Poultry Trade Permit",
  FERTILIZER_TRADE_PERMIT: "Fertilizer Trade Permit",
  STORAGE_CERTIFICATE: "Storage Certificate"
};

const DemandVendeur = () => {
  const { userData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    numeroPhone: '',
    adressProfessionnel: '',
    categorieProduitMarche: '',
    nometprenomlegal: '',
    Marchpardefaut: '',
    adressDeStockage: ''
  });
  
  const [files, setFiles] = useState(
    Object.keys(DOCUMENT_TYPES).reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (fileType) => (e) => {
    setFiles(prev => ({ ...prev, [fileType]: e.target.files[0] }));
  };

  const validateTunisianPhone = (phone) => {
    const regex = /^(?:\+216|00216|0)[2-9]\d{7}$/;
    return regex.test(phone);
  };

  const validateForm = () => {
    if (!validateTunisianPhone(formData.numeroPhone)) {
      toast.error('Please enter a valid Tunisian phone number');
      return false;
    }

    const missingFields = Object.keys(formData).filter(
      key => !formData[key]
    );
    if (missingFields.length > 0) {
      toast.error('Please fill all required fields');
      return false;
    }

    const missingDocuments = Object.keys(files).filter(key => !files[key]);
    if (missingDocuments.length > 0) {
      toast.error(`Please upload all required documents: ${missingDocuments.map(d => DOCUMENT_TYPES[d]).join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append user data
      formDataToSend.append('userId', userData.userId);
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append all required documents
      Object.entries(files).forEach(([key, file]) => {
        formDataToSend.append(key, file);
      });

      const response = await axios.post(
        'http://localhost:4000/api/vendeur/', 
        formDataToSend, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Vendeur registration submitted successfully!');
      
      // Reset form
      setFormData({
        numeroPhone: '',
        adressProfessionnel: '',
        categorieProduitMarche: '',
        nometprenomlegal: '',
        Marchpardefaut: '',
        adressDeStockage: ''
      });
      setFiles(
        Object.keys(DOCUMENT_TYPES).reduce((acc, key) => {
          acc[key] = null;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error(error.response?.data?.message || 'Failed to submit registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Vendeur Registration</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="text"
              value={userData.userId}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            />
          </div>

          {Object.entries({
            numeroPhone: 'Phone Number',
            adressProfessionnel: 'Professional Address',
            categorieProduitMarche: 'Product Categories (comma separated)',
            nometprenomlegal: 'Legal Name',
            Marchpardefaut: 'Default Market',
            adressDeStockage: 'Storage Address'
          }).map(([field, label]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type={field === 'numeroPhone' ? 'tel' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                placeholder={
                  field === 'numeroPhone' ? 'e.g., +21612345678' :
                  field === 'categorieProduitMarche' ? 'e.g., Vegetables, Fruits, Dairy' :
                  field === 'Marchpardefaut' ? 'e.g., Tunis Central Market' : ''
                }
              />
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-medium mb-4">Required Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(DOCUMENT_TYPES).map(([docType, docLabel]) => (
              <div key={docType} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {docLabel} *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id={docType}
                    onChange={handleFileChange(docType)}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <label
                    htmlFor={docType}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 text-sm"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-gray-600 truncate max-w-xs">
                    {files[docType] ? files[docType].name : 'No file chosen'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DemandVendeur;