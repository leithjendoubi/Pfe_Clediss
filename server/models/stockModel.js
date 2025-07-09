import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  stockeurId: { type: String, required: true }, 
  userId: { type: String, required: true },
  equipementId: { type: String, required: true },
  dateentre: { type: Date ,  required: true }, 
  datesortie :{type: Date ,  required: true },
  produitid:{type: String, required : false},
  poidsastocker:{type:Number,required : false},
  statusdedamnd: { type: String, default: "en traitement" },
  datedecreation: { type: Date, default: Date.now },
});

const stockModel = mongoose.models.stock || mongoose.model("Stock", stockSchema);
export default stockModel;