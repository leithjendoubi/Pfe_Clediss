import express from 'express';
import {
    createEquipement,
    getAllEquipement,
    getEquipementByUserId,
    getEquipementByUserIdAvailable,
    addProduitStock,
    getTotalPrice,
} from '../controllers/equipementStockageController.js'; // Ensure all controller functions are imported
import upload from "../middleware/multer.js"; // Multer configuration for file uploads

const equipementRouter = express.Router();

// Route to create new equipment
// Requires user authentication and handles image upload
equipementRouter.post('/create', upload.single('image'), createEquipement);

// Route to get all equipment
// Requires user authentication
equipementRouter.get('/all', getAllEquipement);

// Route to get equipment by UserId
// Requires user authentication
equipementRouter.get('/user/:UserId', getEquipementByUserId);


equipementRouter.get('/user/:UserId/available', getEquipementByUserIdAvailable);


equipementRouter.post('/add-product', addProduitStock);


equipementRouter.post('/total-price', getTotalPrice);



export default equipementRouter;