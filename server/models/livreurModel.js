import mongoose from "mongoose";

const livreurSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  documents: { type: Array, required: true },
  citeprincipale: { type: String, required: false },
  VolumeDisponibleParDefaut: { type: Number, default: 0 },
  poidsMaximale: { type: Number, default: 0 },
  ordreId: { type: String, default: "" },
  soldeavenir: { type: Number, default: 0 },
  solde: { type: Number, default: 0 },
  statutDemande:{type:String , default:"en train de traité"},
  telephone: { type: Number, required:true },

});

const livreurModel = mongoose.models.Livreur || mongoose.model("Livreur", livreurSchema);

export default livreurModel;
