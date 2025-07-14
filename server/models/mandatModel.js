import mongoose from "mongoose";

const mandatSchema = new mongoose.Schema({
  VendeurID: { type: String, required: true },
  PRODUCTEURid: { type: String, required: true },
  Percentage: { type: Number, required: true },
  Productid: { type: String, required: true },
  Description: { type: String, required: true },
  statutoffre: { type: String, default: "waiting", enum: ["waiting", "accepted", "rejected"] },
});

const MandatModel = mongoose.models.Mandat || mongoose.model("Mandat", mandatSchema);

export default MandatModel;