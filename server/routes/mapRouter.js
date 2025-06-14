import express from 'express';
import {
  addUserAddress,
  addLivreurAddress,
  addMarcheAddress,
  getUserAddressById,
  getLivreurAddressById,
  getAllAddresses
} from '../controllers/mapController.js';

const maprouter = express.Router();

// Add addresses
maprouter.post('/user', addUserAddress);
maprouter.post('/livreur', addLivreurAddress);
maprouter.post('/marche', addMarcheAddress);

// Get addresses
maprouter.get('/user/:userId', getUserAddressById);
maprouter.get('/livreur/:livreurId', getLivreurAddressById);
maprouter.get('/all', getAllAddresses);

export default maprouter;