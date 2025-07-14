import express from 'express';
import {
  createStockEntry,
  updateStockStatus,
  getUserStockEntries,
  getStockEntryById,
  getEquipmentStockEntries,
  deleteStockEntry,
  updateStockEntry,getStockByStockeurId,getStockByUserId
} from '../controllers/stockController.js';

const stockRouter = express.Router();


stockRouter.post('/', createStockEntry);
stockRouter.get('/stockeur/:stockeurId', getStockByStockeurId);
stockRouter.get('/user/:userId', getStockByUserId);





stockRouter.get('/equipment/:equipementId', getEquipmentStockEntries);


stockRouter.get('/:id', getStockEntryById);


stockRouter.put('/:id', updateStockEntry);


stockRouter.patch('/:id/status', updateStockStatus);


stockRouter.delete('/:id', deleteStockEntry);

export default stockRouter;