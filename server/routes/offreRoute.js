import express from 'express';
import { 
  addOffre, 
  updateStatutOffreByOrderID, 
  deleteOffre, 
  getOffresByOrderID, 
  getOffreByUserID 
} from '../controllers/offreController.js';

const offrerouter = express.Router();

// Routes for offer management
offrerouter.post('/offres', addOffre);
offrerouter.put('/offres/order/:ordreId', updateStatutOffreByOrderID);
offrerouter.delete('/offres/:id', deleteOffre);
offrerouter.get('/offres/order/:ordreId', getOffresByOrderID);
offrerouter.get('/offres/user/:userId', getOffreByUserID);

export default offrerouter;