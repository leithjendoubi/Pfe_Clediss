import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

const AddLivreur = () => {
  const { userData } = useContext(AppContext);
  const [telephone, setTelephone] = useState('');
  const [files, setFiles] = useState({
    carteGrise: null,
    carteCin: null,
    form: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (fileType) => (e) => {
    if (e.target.files[0]) {
      setFiles(prev => ({ ...prev, [fileType]: e.target.files[0] }));
    }
  };

  const validateTunisianPhone = (phone) => {
    const regex = /^(?:\+216|00216|0)[2-9]\d{7}$/;
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateTunisianPhone(telephone)) {
      toast.error('Please enter a valid Tunisian phone number (e.g., +21612345678, 0021612345678, or 012345678)');
      return;
    }

    if (!files.carteGrise || !files.carteCin || !files.form) {
      toast.error('Please upload all required documents');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('userId', userData.userId);
      formData.append('telephone', telephone);
      formData.append('documents', files.carteGrise);
      formData.append('documents', files.carteCin);
      formData.append('documents', files.form);

      const response = await axios.post(
        'http://localhost:4000/api/livreur/addDemande', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Demande submitted successfully!');
      console.log('Response:', response.data);
      
      // Reset form
      setTelephone('');
      setFiles({
        carteGrise: null,
        carteCin: null,
        form: null
      });
    } catch (error) {
      console.error('Error submitting demande:', error);
      toast.error(error.response?.data?.message || 'Failed to submit demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Submit Livreur Demande</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">User ID</label>
          <input
            type="text"
            value={userData.userId}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tunisian Telephone</label>
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="e.g., +21612345678, 0021612345678, or 012345678"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Format: +216XX XXXXXX, 00216XX XXXXXX, or 0XX XXXXXX</p>
        </div>

        {/* Document Upload Sections */}
        {['carteGrise', 'carteCin', 'form'].map((docType) => (
          <div key={docType} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {docType === 'carteGrise' ? 'Carte Grise' : 
               docType === 'carteCin' ? 'Carte CIN' : 'Completed Form'}
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700"
              >
                Choose File
              </label>
              <span className="text-sm text-gray-600">
                {files[docType] ? files[docType].name : 'No file chosen'}
              </span>
            </div>
          </div>
        ))}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Demande'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLivreur;