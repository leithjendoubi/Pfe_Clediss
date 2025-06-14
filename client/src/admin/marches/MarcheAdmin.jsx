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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Cairo, sans-serif'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '500px',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        direction: 'rtl'
      }}>
        <h1 style={{
          direction: 'rtl',
          fontFamily: 'Cairo',
          color: '#2c3e50',
          textAlign: 'center',
          marginBottom: '2rem',
          fontWeight: '600'
        }}>
          إضافة سوق جديد
        </h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="coolinput">
            <label htmlFor="jourCongé" className="text" style={{ 
              direction: 'rtl', 
              fontFamily: 'Cairo',
              color: '#2c3e50',
              fontWeight: '500'
            }}>
              يوم الإغلاق:
            </label>
            <select
              id="jourCongé"
              name="jourCongé"
              className="input"
              value={formData.jourCongé}
              onChange={handleChange}
              required
              style={{ 
                direction: 'rtl', 
                fontFamily: 'Cairo',
                padding: '0.75rem'
              }}
            >
              <option value="">اختر يوم الإغلاق</option>
              {joursSemaine.map((jour, index) => (
                <option key={index} value={jour} style={{ direction: 'rtl' }}>{jour}</option>
              ))}
            </select>
          </div>

          <div className="coolinput">
            <label htmlFor="typeDeMarche" className="text" style={{ 
              direction: 'rtl', 
              fontFamily: 'Cairo',
              color: '#2c3e50',
              fontWeight: '500'
            }}>
              نوع السوق:
            </label>
            <select
              id="typeDeMarche"
              name="typeDeMarche"
              className="input"
              value={formData.typeDeMarche}
              onChange={handleChange}
              required
              style={{ 
                direction: 'rtl', 
                fontFamily: 'Cairo',
                padding: '0.75rem'
              }}
            >
              <option value="">اختر نوع السوق</option>
              {typesMarche.map((type, index) => (
                <option key={index} value={type} style={{ direction: 'rtl' }}>{type}</option>
              ))}
            </select>
          </div>

          <div className="coolinput">
            <label htmlFor="cité" className="text" style={{ 
              direction: 'rtl', 
              fontFamily: 'Cairo',
              color: '#2c3e50',
              fontWeight: '500'
            }}>
              المدينة:
            </label>
            <input
              type="text"
              id="cité"
              name="cité"
              className="input"
              placeholder="أدخل اسم المدينة"
              value={formData.cité}
              onChange={handleChange}
              required
              style={{ 
                direction: 'rtl', 
                fontFamily: 'Cairo',
                padding: '0.75rem'
              }}
            />
          </div>

          <div className="coolinput">
            <label htmlFor="nomComplet" className="text" style={{ 
              direction: 'rtl', 
              fontFamily: 'Cairo',
              color: '#2c3e50',
              fontWeight: '500'
            }}>
              الاسم الكامل:
            </label>
            <input
              type="text"
              id="nomComplet"
              name="nomComplet"
              className="input"
              placeholder="أدخل الاسم الكامل للسوق"
              value={formData.nomComplet}
              onChange={handleChange}
              required
              style={{ 
                direction: 'rtl', 
                fontFamily: 'Cairo',
                padding: '0.75rem'
              }}
            />
          </div>

          <div className="coolinput">
            <label htmlFor="categorieMarche" className="text" style={{ 
              direction: 'rtl', 
              fontFamily: 'Cairo',
              color: '#2c3e50',
              fontWeight: '500'
            }}>
              الفئة:
            </label>
            <select
              id="categorieMarche"
              name="categorieMarche"
              className="input"
              value={formData.categorieMarche}
              onChange={handleChange}
              required
              style={{ 
                direction: 'rtl', 
                fontFamily: 'Cairo',
                padding: '0.75rem'
              }}
            >
              <option value="">اختر فئة السوق</option>
              {categories.map((categorie, index) => (
                <option key={index} value={categorie} style={{ direction: 'rtl' }}>{categorie}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            style={{
              padding: '0.75rem',
              backgroundColor: '#818CF8',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              marginTop: '1rem',
              fontFamily: 'Cairo',
              direction: 'rtl',
              transition: 'background-color 0.3s',
              ':hover': {
                backgroundColor: '#6b75d6'
              }
            }}
          >
            إضافة
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarcheAdmin;