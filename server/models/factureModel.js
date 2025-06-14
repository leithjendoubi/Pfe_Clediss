import mongoose from "mongoose";

const factureSchema = new mongoose.Schema({
  UserId: { type: String, required: true },
  Numérofacture: { type: Number },
  Date: { type: Date, default: Date.now },
  TitresDesProduits: { type: String },
  PoidsEnTon: { type: Number, required: true },
  PoidsNetEnTon: { type: Number, required: true },
  TotalEnDinar: { type: Number, required: true },
  PourcentageDeTax: { type: Number, required: true },
  NomDeProducteur: { type: String, required: true },
  NomDeStockeur: { type: String, required: true }
});

const factureModel = mongoose.models.Facture || mongoose.model("Facture", factureSchema);
export default factureModel;