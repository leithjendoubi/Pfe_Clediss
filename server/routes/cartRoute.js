import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
  deleteProductFromCart,
  deleteUserCart
} from "../controllers/cartController.js";
import userAuth from "../middleware/userAuth.js";

const cartRouter = express.Router();

cartRouter.post("/get", userAuth, getUserCart);
cartRouter.post('/delete-cart', deleteUserCart);
cartRouter.post("/delete", userAuth, deleteProductFromCart);
cartRouter.post("/add", userAuth,addToCart);
cartRouter.post("/update", userAuth,updateCart);

export default cartRouter;
