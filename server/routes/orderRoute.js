import express from "express";
import {
  addOrder,
  deleteOrder,
  getOrdersByUserId,
  getOrdersWithWaitingLivreur,
  affectLivreurId,
  updateStatut,
  getAllOrders,
  getOrderById,
  getOrdersByLivreurId,
  setListOfUsersToConfirm,
  updateUserConfirmationStatus
} from "../controllers/orderController.js";

const orderrouter = express.Router();

orderrouter.post("/add", addOrder);
orderrouter.post("/addd", setListOfUsersToConfirm);
orderrouter.delete("/:id", deleteOrder);
orderrouter.get("/user/:userId", getOrdersByUserId);
orderrouter.get("/waiting-livreur", getOrdersWithWaitingLivreur);
orderrouter.put("/affect-livreur/:id", affectLivreurId);
orderrouter.put("/update-status/:id", updateStatut);
orderrouter.put("/confirm/:id", updateUserConfirmationStatus);
orderrouter.get("/get", getAllOrders);
orderrouter.get("/:id", getOrderById);
orderrouter.get("/orders/:livreurId", getOrdersByLivreurId);
export default orderrouter;