import express from "express";
import {
  addProducteur,
  acceptStatutDemande,
  refusStatutDemande,
  userIsProducteur,
  getDemandProducteurs,
  getDemandProducteursaccepted,
  getProducteurDataByUserId,
  deleteProducteur,
  stopProducteur,
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

producteurRouter.get("/demands", getDemandProducteurs);
producteurRouter.get("/demandsaccepted", getDemandProducteursaccepted);

// Accept producteur demande
producteurRouter.put("/:producteurId/accept-demande", acceptStatutDemande);
producteurRouter.put("/:producteurId/stop", stopProducteur);
// Refuse producteur demande (with reason in body)
producteurRouter.put("/:producteurId/refuse-demande", refusStatutDemande);

// Accept engrais demande

producteurRouter.get("/data/:userId", getProducteurDataByUserId);

// Get producteur statuses by userId
producteurRouter.get("/status/:userId", userIsProducteur);
producteurRouter.delete("/:producteurId", deleteProducteur);


export default producteurRouter;