import express from 'express';
import {
  addVendeur,
  acceptStatutDemande,
  refusStatutDemande,
  userIsVendeur,
  getVendeurDataByUserId,
  getAcceptedDemandsVendeurs,
  deleteVendeur,
stopVendeur,
  getDemandsVendeurs,
  getallvenders,
} from '../controllers/vendeurController.js';
import upload from '../middleware/multer.js';

const vendeurRouter = express.Router();

// Document fields configuration for upload
const documentFields = [
  { name: 'BUSINESS_LICENSE', maxCount: 1 },
  { name: 'ID_CARD_COPY', maxCount: 1 },
  { name: 'TAX_REGISTRATION', maxCount: 1 },
  { name: 'POULTRY_TRADE_PERMIT', maxCount: 1 },
  { name: 'FERTILIZER_TRADE_PERMIT', maxCount: 1 },
  { name: 'STORAGE_CERTIFICATE', maxCount: 1 }
];

// Vendeur registration route with document upload
vendeurRouter.post("/", upload.fields(documentFields), addVendeur);

// Status management routes
vendeurRouter.put("/accept/:vendeurId", acceptStatutDemande);
vendeurRouter.put("/refuse/:vendeurId", refusStatutDemande);
vendeurRouter.get("/demands", getDemandsVendeurs);
vendeurRouter.get("/getall", getallvenders);
vendeurRouter.get("/demandsaccepted", getAcceptedDemandsVendeurs);




// Check vendeur status
vendeurRouter.get("/statut/:userId", userIsVendeur);
vendeurRouter.delete("/:vendeurId", deleteVendeur);
vendeurRouter.put("/:vendeurId/stop", stopVendeur);
// Get complete vendeur data by userId
vendeurRouter.get("/data/:userId", getVendeurDataByUserId);

export default vendeurRouter;