import express from "express";
import { addStockiste , getAllStockiste,getStockisteDemands,acceptDemand,suspenderStockiste , getStockisteByUserId} from "../controllers/stockisteController.js";
import upload from "../middleware/multer.js";

const documentFields = [
  { name: "TAX_NUMBER", maxCount: 1 },
  { name: "MUNICIPAL_OPERATING_LICENSE", maxCount: 1 },
  { name: "TECHNICAL_CERTIFICATE", maxCount: 1 },
  { name: "COMMERCIAL_REGISTRATION", maxCount: 1 },
];

const stockisteRouter = express.Router();

// Add a new stockiste
stockisteRouter.post("/add", upload.fields(documentFields), addStockiste);
stockisteRouter.get("/demands", getStockisteDemands);
stockisteRouter.put("/accept/:id", acceptDemand);
stockisteRouter.get("/", getAllStockiste);
stockisteRouter.get("/user/:userId", getStockisteByUserId);
stockisteRouter.put("/suspend/:id", suspenderStockiste);

export default stockisteRouter;