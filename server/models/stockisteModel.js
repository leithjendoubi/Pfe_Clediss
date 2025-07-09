import mongoose from "mongoose";

const stockisteSchema = new mongoose.Schema({
  nomlegal: { type: String, required: true }, 
  userId: { type: String, required: true },
  numeroPhone: { type: Number, required: true },
  documents: { type: Map, required: true }, 
  addressProfessionelle: { type: mongoose.Schema.Types.Mixed, required: true },
  typedestockage: { type: String, default: "waiting" },
  statusdedamnd: { type: String, default: "en traitement" },
  datedecreation: { type: Date, default: Date.now },
});

const stockisteModel = mongoose.models.stockiste || mongoose.model("Stockiste", stockisteSchema);
export default stockisteModel;
