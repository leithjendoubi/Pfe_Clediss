import mongoose from "mongoose";

const equipementStockageSchema = new mongoose.Schema({
  UserId: { type: String, required: true },
  image: { type: String, default: "" },
  Date: { type: Date, default: Date.now },
  nom: { type: String, required: true },
  Poidsdisponibleenkillo: { type: Number, required: true },
  Poidsstocker: { type: Number, default: 0 },
  listdesproduits: [{ type: String }],
  Prixparjour: { type: Number, required: true },
  Prixparkillo: { type: Number, required: true },
});

const equipementStockageModel = mongoose.models.equipementStockage || mongoose.model("EquipementStockage", equipementStockageSchema);
export default equipementStockageModel;