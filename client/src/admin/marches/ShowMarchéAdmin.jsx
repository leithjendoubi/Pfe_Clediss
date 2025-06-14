import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MarcheAdmin from './MarcheAdmin';
import './ShowMarcheAdmin.css';

const ShowMarchéAdmin = () => {
  const [marches, setMarches] = useState([]);
  const [filteredMarches, setFilteredMarches] = useState([]);
  const [filters, setFilters] = useState({
    cité: '',
    categorieMarche: ''
  });
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchMarches = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/marche/');
        setMarches(response.data);
        setFilteredMarches(response.data);
      } catch (error) {
        console.error('Error fetching marches:', error);
      }
    };
    fetchMarches();
  }, []);

  useEffect(() => {
    let results = marches;
    if (filters.cité) {
      results = results.filter(m => m.cité.includes(filters.cité));
    }
    if (filters.categorieMarche) {
      results = results.filter(m => m.categorieMarche.includes(filters.categorieMarche));
    }
    setFilteredMarches(results);
  }, [filters, marches]);

  const isMarcheActive = (periode) => {
    if (!periode || periode.length === 0) return false;
    const { dateDebut, dateFin } = periode[0];
    return currentDate >= dateDebut && currentDate <= dateFin;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Refresh data after dialog closes
    const fetchMarches = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/marche/');
        setMarches(response.data);
        setFilteredMarches(response.data);
      } catch (error) {
        console.error('Error fetching marches:', error);
      }
    };
    fetchMarches();
  };

  return (
    <div className="marche-admin-container">
      <h1 style={{ fontFamily: 'Cairo', color: '#2c3e50', textAlign: 'center' }}>إدارة الأسواق</h1>
      
      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label className="arabic-text">تصفية حسب المدينة:</label>
          <input
            type="text"
            value={filters.cité}
            onChange={(e) => setFilters({...filters, cité: e.target.value})}
            placeholder="ابحث بالمدينة"
          />
        </div>
        <div className="filter-group">
          <label className="arabic-text">تصفية حسب الفئة:</label>
          <input
            type="text"
            value={filters.categorieMarche}
            onChange={(e) => setFilters({...filters, categorieMarche: e.target.value})}
            placeholder="ابحث بالفئة"
          />
        </div>
      </div>

      {/* Marche Table */}
      <div className="table-container">
        <table className="marche-table">
          <thead>
            <tr>
              <th>الحالة</th>
              <th>الاسم الكامل</th>
              <th>نوع السوق</th>
              <th>المدينة</th>
              <th>الفئة</th>
              <th>يوم الإغلاق</th>
              <th>تاريخ البدء</th>
              <th>تاريخ الانتهاء</th>
              <th>تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarches.map((marche) => {
              const isActive = isMarcheActive(marche.periodeDeTravail);
              const periode = marche.periodeDeTravail?.[0] || {};
              
              return (
                <tr key={marche._id}>
                  <td>
                    <input
                      type="radio"
                      checked={isActive}
                      readOnly
                    />
                    {isActive ? 'نشط' : 'غير نشط'}
                  </td>
                  <td className="marche-name">{marche.nomComplet}</td>
                  <td>{marche.typeDeMarche}</td>
                  <td>{marche.cité}</td>
                  <td>{marche.categorieMarche}</td>
                  <td>{marche.jourCongé}</td>
                  <td>{periode.dateDebut}</td>
                  <td>{periode.dateFin}</td>
                  <td>{new Date(marche.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add New Market Button - Positioned left under table */}
      <div className="button-container">
        <button className="button" onClick={handleClickOpen}>
          إضافة سوق جديد
        </button>
      </div>

      {/* Material-UI Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          إضافة سوق جديد
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              left: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <MarcheAdmin onSuccess={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowMarchéAdmin;