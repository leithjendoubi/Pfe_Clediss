import express from 'express';
import { 
  createMandat,
  updateMandatStatus,
  deleteMandat,
  getMandatsByProduct,
  getMandatsBySeller,
  getMandatsByProducer,
  getMandatById
} from '../controllers/mandatController.js';

const mandatRouter = express.Router();

// Routes for mandat management
mandatRouter.post('/mandats', createMandat);
mandatRouter.put('/mandats/status/:id', updateMandatStatus);
mandatRouter.delete('/mandats/:id', deleteMandat);
mandatRouter.get('/mandats/product/:Productid', getMandatsByProduct);
mandatRouter.get('/mandats/seller/:VendeurID', getMandatsBySeller);
mandatRouter.get('/mandats/producer/:PRODUCTEURid', getMandatsByProducer);
mandatRouter.get('/mandats/:id', getMandatById);

export default mandatRouter;