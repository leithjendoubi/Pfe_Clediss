import Facture from "../models/factureModel.js";


export const addFacture = async (req, res) => {
  try {
    const {
      UserId,
      Numérofacture,
      TitresDesProduits,
      PoidsEnTon,
      PoidsNetEnTon,
      TotalEnDinar,
      PourcentageDeTax,
      NomDeProducteur,
      NomDeStockeur
    } = req.body;

    const newFacture = new Facture({
      UserId,
      Numérofacture,
      TitresDesProduits,
      PoidsEnTon,
      PoidsNetEnTon,
      TotalEnDinar,
      PourcentageDeTax,
      NomDeProducteur,
      NomDeStockeur
    });

    const savedFacture = await newFacture.save();
    res.status(201).json(savedFacture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getFactureByUserId = async (req, res) => {
  try {
    const { UserId } = req.body; // Getting UserId from request body
    
    if (!UserId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const factures = await Facture.find({ UserId });
    
    if (factures.length === 0) {
      return res.status(404).json({ message: "No factures found for this user" });
    }

    res.status(200).json(factures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};