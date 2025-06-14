import mongoose from "mongoose";

const mapSchema = new mongoose.Schema({
  userAddress: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    coordinates: { type: [Number], default: [] }
  },
  livreurAddress: {
    livreurId: { type: mongoose.Schema.Types.ObjectId, ref: "Livreur" },
    coordinates: { type: [Number] }
  },
  marcheAddress: {
    marcheId: { type: mongoose.Schema.Types.ObjectId, ref: "Marche" },
    coordinates: { type: [Number] }
  },
  orderAddress: {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    coordinates: { type: [Number], default: [] }
  }
});

const mapModel = mongoose.models.Map || mongoose.model("Map", mapSchema);

export default mapModel;