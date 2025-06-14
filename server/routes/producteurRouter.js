import express from "express";
import {
  addProducteur,
  acceptStatutDemande,
  refusStatutDemande,
  acceptStatutDemandeEngrais,
  refusStatutDemandeEngrais,
  acceptStatutDemandeVolaille,
  refusStatutDemandeVolaille,
  userIsProducteur,
  addDemandeEngrais,
  addDemandeVolaille
} from "../controllers/producteurController.js";
import upload from "../middleware/multer.js";



const documentFields = [
  { name: 'FARMERS_UNION_FORM', maxCount: 1 },
  { name: 'APPLICANT_STATUS_CERTIFICATE', maxCount: 1 },
  { name: 'ID_CARD_COPY', maxCount: 1 },
  { name: 'POULTRY_TRADE_PERMIT', maxCount: 1 },
  { name: 'FERTILIZER_TRADE_PERMIT', maxCount: 1 },
  { name: 'STORAGE_CERTIFICATE', maxCount: 1 }
];

const producteurRouter = express.Router();

// Add a new producteur
producteurRouter.post("/", upload.fields(documentFields), addProducteur);

// Accept producteur demande
producteurRouter.put("/:producteurId/accept-demande", acceptStatutDemande);

// Refuse producteur demande (with reason in body)
producteurRouter.put("/:producteurId/refuse-demande", refusStatutDemande);

// Accept engrais demande
producteurRouter.put("/:producteurId/accept-engrais", acceptStatutDemandeEngrais);

// Refuse engrais demande (with reason in body)
producteurRouter.put("/:producteurId/refuse-engrais", refusStatutDemandeEngrais);

// Accept volaille demande
producteurRouter.put("/:producteurId/accept-volaille", acceptStatutDemandeVolaille);

// Refuse volaille demande (with reason in body)
producteurRouter.put("/:producteurId/refuse-volaille", refusStatutDemandeVolaille);

// Get producteur statuses by userId
producteurRouter.get("/status/:userId", userIsProducteur);

producteurRouter.patch("/:userId/request-engrais", addDemandeEngrais);
producteurRouter.patch("/:userId/request-volaille", addDemandeVolaille);

export default producteurRouter;