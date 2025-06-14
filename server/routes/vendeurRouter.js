import express from 'express';
import {
  addVendeur,
  acceptStatutDemande,
  refusStatutDemande,
  acceptStatutDemandeEngrais,
  refusStatutDemandeEngrais,
  acceptStatutDemandeVolaille,
  refusStatutDemandeVolaille,
  userIsVendeur,
  addDemandeEngrais,
  addDemandeVolaille,
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
vendeurRouter.put("/accept-engrais/:vendeurId", acceptStatutDemandeEngrais);
vendeurRouter.put("/refuse-engrais/:vendeurId", refusStatutDemandeEngrais);
vendeurRouter.put("/accept-volaille/:vendeurId", acceptStatutDemandeVolaille);
vendeurRouter.put("/refuse-volaille/:vendeurId", refusStatutDemandeVolaille);

vendeurRouter.patch("/:userId/request-engrais", addDemandeEngrais);
vendeurRouter.patch("/:userId/request-volaille", addDemandeVolaille);

// Check vendeur status
vendeurRouter.get("/status/:userId", userIsVendeur);

export default vendeurRouter;