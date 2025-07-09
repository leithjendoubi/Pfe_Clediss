import mongoose from "mongoose";

const producteurSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  numeroPhone: { 
    type: Number, 
    required: true 
  },
  adressProfessionnel: { 
    type: String, 
    required: true 
  },
  categorieProduitMarche: { 
    type: Array, 
    required: true,
    default: [] 
  },
    typeDesProducteurs: { 
    type: String, 
    required: true 
  },

  nometprenomlegal: { 
    type: String, 
    required: true 
  },
  documents: { 
    type: Map, 
    required: true 
  },
  adressDeStockage: { 
    type: String, 
    required: false,
    default :"" 
  },
  statutdemande: {
    type: String,
    default: "في المعالجة"
  }
}, { timestamps: true });

const Producteur = mongoose.models.Producteur || mongoose.model("Producteur", producteurSchema);

export default Producteur;