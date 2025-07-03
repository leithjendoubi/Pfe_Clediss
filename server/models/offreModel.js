import mongoose from "mongoose";

const OffreSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  typeoffre: { type: String, required: true, enum: ["livraison"] },
  pricepardinar: { type: Number, required: true },
  ordreId: { type: String, required: true },
  statutoffre: { type: String, default: "waiting", enum: ["waiting", "accepted", "rejected"] },
});

const OffreModel = mongoose.models.Offre || mongoose.model("Offre", OffreSchema);

export default OffreModel;