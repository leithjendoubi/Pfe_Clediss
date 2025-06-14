import mongoose from "mongoose";

const marcheSchema = new mongoose.Schema({
  jourCongé: {
    type: String,
    required: true
  },
  typeDeMarche: {
    type: String,
    required: true
  },
  cité: {
    type: String,
    required: true
  },
  nomComplet: {
    type: String,
    required: true
  },
  categorieMarche: {
    type: String,
    required: true
  },
  periodeDeTravail: {
    type: [{
      _id: false,  // Add this line to disable _id
      dateDebut: {
        type: Date,
        default: Date.now
      },
      dateFin: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000)
      }
    }],
    required: true
  },
  produitsAVenir: {
    type: [String],
    default: []
  },
  produits: {
    type: [{
      produitId: String,
      dateDeVenir: Date
    }],
    default: []
  }
}, { timestamps: true });

const Marche = mongoose.models.Marche || mongoose.model("Marche", marcheSchema);

export default Marche;