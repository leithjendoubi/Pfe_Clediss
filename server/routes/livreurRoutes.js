import express from "express";
import upload from "../middleware/multer.js";
import { addDemande , getalllivreur , getlivreuraccepte , acceptdemande,rejectdemande,getlivreurdemande , getLivreurByUserId , updateLivreurProfile} from "../controllers/livreurController.js";

const livreurRouter = express.Router();

livreurRouter.post('/addDemande', upload.array('documents', 3), addDemande);
livreurRouter.get('/getall',getalllivreur);
livreurRouter.get('/getaccepte',getlivreuraccepte);
livreurRouter.post('/accept',acceptdemande);
livreurRouter.get('/demande',getlivreurdemande);
livreurRouter.post('/rejecct',rejectdemande);
livreurRouter.get("/by-user/:userId", getLivreurByUserId);
livreurRouter.patch("/update/:userId", updateLivreurProfile);




export default livreurRouter;
