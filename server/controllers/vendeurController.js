import Vendeur from "../models/vendeurModel.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Document types mapping (English keys to Arabic names)
const DOCUMENT_TYPES = {
  BUSINESS_LICENSE: "رخصة تجارية",
  ID_CARD_COPY: "نسخة بطاقة التعريف",
  TAX_REGISTRATION: "شهادة التسجيل الضريبي",
  POULTRY_TRADE_PERMIT: "تصريح تجارة الدواجن",
  FERTILIZER_TRADE_PERMIT: "تصريح تجارة الأسمدة",
  STORAGE_CERTIFICATE: "شهادة المخزن"
};

export const addVendeur = async (req, res) => {
  try {
    const {
      numeroPhone,
      adressProfessionnel,
      categorieProduitMarche,
      nometprenomlegal,
      Marchpardefaut,
      adressDeStockage,
      typeDesVendeurs,
    } = req.body;
    
    const userId = req.body.userId;

    // Basic field validation
    if (!userId || !numeroPhone || !adressProfessionnel || 
        !categorieProduitMarche || !nometprenomlegal || !Marchpardefaut || !adressDeStockage || !typeDesVendeurs) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for existing vendeur
    const existingVendeur = await Vendeur.findOne({ userId });
    if (existingVendeur) {
      return res.status(400).json({ message: "Vendeur already exists for this user" });
    }

    // Process documents
    const documentsMap = {};
    
    if (req.files) {
      for (const [fieldName, files] of Object.entries(req.files)) {
        const file = files[0];
        const arabicName = DOCUMENT_TYPES[fieldName] || fieldName;

        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "vendeur_documents",
            resource_type: "auto"
          });

          documentsMap[fieldName] = {
            url: result.secure_url,
            public_id: result.public_id,
            title: arabicName,
            uploadedAt: new Date()
          };

          fs.unlinkSync(file.path);
        } catch (uploadError) {
          console.error(`Failed to upload ${fieldName}:`, uploadError);
        }
      }
    }

    // Create vendeur
    const newVendeur = new Vendeur({
      userId,
      numeroPhone,
      adressProfessionnel,
      categorieProduitMarche,
      nometprenomlegal,
      Marchpardefaut,
      documents: documentsMap,
      adressDeStockage,
      typeDesVendeurs,      
    });

    await newVendeur.save();
    res.status(201).json({
      ...newVendeur.toObject(),
      message: "Vendeur created successfully"
    });

  } catch (error) {
    // Cleanup any remaining files
    if (req.files) {
      Object.values(req.files).forEach(files => {
        files.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      });
    }
    res.status(500).json({ 
      message: "Error creating vendeur",
      error: error.message 
    });
  }
};

// Accept vendeur demande (set statutdemande to "مقبول")
export const acceptStatutDemande = async (req, res) => {
  try {
    const { vendeurId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(vendeurId)) {
      return res.status(400).json({ message: "Invalid vendeur ID" });
    }

    const updatedVendeur = await Vendeur.findByIdAndUpdate(
      vendeurId,
      { statutdemande: "مقبول" },
      { new: true }
    );

    if (!updatedVendeur) {
      return res.status(404).json({ message: "Vendeur not found" });
    }

    res.json(updatedVendeur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refuse vendeur demande
export const refusStatutDemande = async (req, res) => {
  try {
    const { vendeurId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(vendeurId)) {
      return res.status(400).json({ message: "Invalid vendeur ID" });
    }

    const updatedVendeur = await Vendeur.findByIdAndUpdate(
      vendeurId,
      { statutdemande: `مرفوض: ${reason}` },
      { new: true }
    );

    if (!updatedVendeur) {
      return res.status(404).json({ message: "Vendeur not found" });
    }

    res.json(updatedVendeur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept engrais demande (set statutdemandeengrais to "مقبول")


// Get vendeur statuses by userId
export const userIsVendeur = async (req, res) => {
  try {
    const { userId } = req.params;

    const vendeur = await Vendeur.findOne({ userId });

    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur not found for this user" });
    }

    // Return true if statutdemande is "مقبول", false otherwise
    const isVendeur = vendeur.statutdemande === "مقبول";

    res.json(isVendeur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const getDemandsVendeurs = async (req, res) => {
  try {
    const demandsVendeurs = await Vendeur.find({ 
      statutdemande: "en traitement" 
    });

    res.status(200).json(demandsVendeurs || []);  // Ensure always returning an array
  } catch (error) {
    console.error("Error fetching vendeurs:", error);
    res.status(500).json({ 
      message: "Error fetching pending vendeurs",
      error: error.message 
    });
  }
};

export const getallvenders = async (req, res) => {
  try {
    const demandsVendeurs = await Vendeur.find({ 
    });

    res.status(200).json(demandsVendeurs || []);  // Ensure always returning an array
  } catch (error) {
    console.error("Error fetching vendeurs:", error);
    res.status(500).json({ 
      message: "Error fetching pending vendeurs",
      error: error.message 
    });
  }
};


export const getAcceptedDemandsVendeurs = async (req, res) => {
  try {
    const DemandsVendeurs = await Vendeur.find({ 
      statutdemande: "مقبول" 
    }); // Exclude documents and version key for cleaner response

    res.status(200).json(DemandsVendeurs);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching accepted Demand Vendeurs",
      error: error.message 
    });
  }
};

export const deleteVendeur = async (req, res) => {
  try {
    const { vendeurId } = req.params;

    const vendeur = await Vendeur.findOneAndDelete({ _id: vendeurId });

    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur not found" });
    }

    res.status(200).json({ message: "Vendeur deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting Vendeur",
      error: error.message 
    });
  }
};


export const stopVendeur = async (req, res) => {
  try {
    const { vendeurId } = req.params;

    const vendeur = await Vendeur.findOneAndUpdate(
      { _id: vendeurId },
      { $set: { statutdemande: "arrêter" } },
      { new: true }
    );

    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur not found" });
    }

    res.status(200).json({ message: "Vendeur stopped successfully", vendeur });
  } catch (error) {
    res.status(500).json({ 
      message: "Error stopping Vendeur",
      error: error.message 
    });
  }
};


export const getVendeurDataByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const vendeur = await Vendeur.findOne({ userId });

    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur not found for this user" });
    }

    // Return all relevant vendeur data
    const vendeurData = {
      userId: vendeur.userId,
      numeroPhone: vendeur.numeroPhone,
      adressProfessionnel: vendeur.adressProfessionnel,
      categorieProduitMarche: vendeur.categorieProduitMarche,
      nometprenomlegal: vendeur.nometprenomlegal,
      Marchpardefaut: vendeur.Marchpardefaut,
      documents: vendeur.documents,
      adressDeStockage: vendeur.adressDeStockage,
      statutdemande: vendeur.statutdemande,
      createdAt: vendeur.createdAt,
      updatedAt: vendeur.updatedAt
    };

    res.json(vendeurData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};