import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  numeroPhone: { type: Number, required: true },
  items: { type: mongoose.Schema.Types.Mixed, required: true },
  amount: { type: Number, required: true },
  amount_livraison: { type: Number, required: true, default: 0 },
  address: { type: mongoose.Schema.Types.Mixed, required: true },
  typeLivraison: { type: String, required: true },
  livreurId: { type: String, default: "waiting" },
  status: { type: String, default: "Order Placed" },
  paymentMethod: { type: String, required: true },
  paymentStatut: { type: String, default: "waiting" },
  date: { type: Date, default: Date.now },
    userConfirmations: {
    type: [[mongoose.Schema.Types.Mixed]],
    default: [],
  },
});

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default orderModel;
