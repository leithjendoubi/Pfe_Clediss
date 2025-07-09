import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MarcheAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jourCongé: '',
    typeDeMarche: '',
    cité: '',
    nomComplet: '',
    categorieMarche: ''
  });
  const [typesMarche, setTypesMarche] = useState([]);
  const [categories, setCategories] = useState([]);
  const [joursSemaine] = useState([
    "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"
  ]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/administration/type-marche')
      .then(res => setTypesMarche(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:4000/api/administration/categories-produits')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/marche/add', formData);
      alert('تم إضافة السوق بنجاح!');
    } catch (error) {
      console.error('خطأ في إضافة السوق:', error);
      alert('حدث خطأ أثناء إضافة السوق');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-right">
        <h1 className="text-2xl font-semibold text-blue-800 mb-6 text-center">
          إضافة سوق جديد
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="jourCongé" className="block text-sm font-medium text-blue-700">
              يوم الإغلاق:
            </label>
            <select
              id="jourCongé"
              name="jourCongé"
              value={formData.jourCongé}
              onChange={handleChange}
              required
              className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">اختر يوم الإغلاق</option>
              {joursSemaine.map((jour, index) => (
                <option key={index} value={jour}>{jour}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="typeDeMarche" className="block text-sm font-medium text-blue-700">
              نوع السوق:
            </label>
            <select
              id="typeDeMarche"
              name="typeDeMarche"
              value={formData.typeDeMarche}
              onChange={handleChange}
              required
              className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">اختر نوع السوق</option>
              {typesMarche.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="cité" className="block text-sm font-medium text-blue-700">
              المدينة:
            </label>
            <input
              type="text"
              id="cité"
              name="cité"
              placeholder="أدخل اسم المدينة"
              value={formData.cité}
              onChange={handleChange}
              required
              className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nomComplet" className="block text-sm font-medium text-blue-700">
              الاسم الكامل:
            </label>
            <input
              type="text"
              id="nomComplet"
              name="nomComplet"
              placeholder="أدخل الاسم الكامل للسوق"
              value={formData.nomComplet}
              onChange={handleChange}
              required
              className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="categorieMarche" className="block text-sm font-medium text-blue-700">
              الفئة:
            </label>
            <select
              id="categorieMarche"
              name="categorieMarche"
              value={formData.categorieMarche}
              onChange={handleChange}
              required
              className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">اختر فئة السوق</option>
              {categories.map((categorie, index) => (
                <option key={index} value={categorie}>{categorie}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
          >
            إضافة
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarcheAdmin;