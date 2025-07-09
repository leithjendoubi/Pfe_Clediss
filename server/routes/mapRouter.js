import express from 'express';
import {
  addUserAddress,
  addLivreurAddress,
  addMarcheAddress,
  addOrderAddress,
  addStockAddress,
  getUserAddressById,
  getLivreurAddressById,
  getOrderAddressById,
  getStockAddressById,
  getAllAddresses
} from '../controllers/mapController.js';

const maprouter = express.Router();

// Add addresses
maprouter.post('/user', addUserAddress);
maprouter.post('/livreur', addLivreurAddress);
maprouter.post('/marche', addMarcheAddress);
maprouter.post('/order', addOrderAddress);
maprouter.post('/stock', addStockAddress);

// Get addresses by ID
maprouter.get('/user/:userId', getUserAddressById);
maprouter.get('/livreur/:livreurId', getLivreurAddressById);
maprouter.get('/order/:orderId', getOrderAddressById);
maprouter.get('/stock/:stockId', getStockAddressById);

// Get all addresses
maprouter.get('/getall', getAllAddresses);

export default maprouter;
