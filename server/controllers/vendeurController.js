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
      adressDeStockage
    } = req.body;
    
    const userId = req.body.userId;

    // Basic field validation
    if (!userId || !numeroPhone || !adressProfessionnel || 
        !categorieProduitMarche || !nometprenomlegal || !Marchpardefaut || !adressDeStockage) {
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
      adressDeStockage
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
export const acceptStatutDemandeEngrais = async (req, res) => {
  try {
    const { vendeurId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(vendeurId)) {
      return res.status(400).json({ message: "Invalid vendeur ID" });
    }

    const updatedVendeur = await Vendeur.findByIdAndUpdate(
      vendeurId,
      { statutdemandeengrais: "مقبول" },
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

// Refuse engrais demande
export const refusStatutDemandeEngrais = async (req, res) => {
  try {
    const { vendeurId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(vendeurId)) {
      return res.status(400).json({ message: "Invalid vendeur ID" });
    }

    const updatedVendeur = await Vendeur.findByIdAndUpdate(
      vendeurId,
      { statutdemandeengrais: `مرفوض: ${reason}` },
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

// Accept volaille demande (set statutdemandevolaille to "مقبول")
export const acceptStatutDemandeVolaille = async (req, res) => {
  try {
    const { vendeurId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(vendeurId)) {
      return res.status(400).json({ message: "Invalid vendeur ID" });
    }

    const updatedVendeur = await Vendeur.findByIdAndUpdate(
      vendeurId,
      { statutdemandevolaille: "مقبول" },
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

// Refuse volaille demande
export const refusStatutDemandeVolaille = async (req, res) => {
  try {
    const { vendeurId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(vendeurId)) {
      return res.status(400).json({ message: "Invalid vendeur ID" });
    }

    const updatedVendeur = await Vendeur.findByIdAndUpdate(
      vendeurId,
      { statutdemandevolaille: `مرفوض: ${reason}` },
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

// Get vendeur statuses by userId
export const userIsVendeur = async (req, res) => {
  try {
    const { userId } = req.params;

    const vendeur = await Vendeur.findOne({ userId });

    if (!vendeur) {
      return res.status(404).json({ message: "Vendeur not found for this user" });
    }

    // Return only the status fields
    const statusData = {
      statutdemande: vendeur.statutdemande,
      statutdemandeengrais: vendeur.statutdemandeengrais,
      statutdemandevolaille: vendeur.statutdemandevolaille
    };

    res.json(statusData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDemandeEngrais = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid seller ID" });
    }

    // Update only the fertilizer status (default: "معالجة" for processing)
    const updatedVendeur = await Vendeur.findByIdAndUpdate(
      userId,
      { statutdemandeengrais: "معالجة" }, // Set to "processing"
      { new: true }
    );

    if (!updatedVendeur) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json({
      message: "Fertilizer trade request submitted",
      statutdemandeengrais: updatedVendeur.statutdemandeengrais,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDemandeVolaille = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid seller ID" });
    }

    // Update only the poultry status (default: "معالجة" for processing)
    const updatedVendeur = await Vendeur.findByIdAndUpdate(
      userId,
      { statutdemandevolaille: "معالجة" }, // Set to "processing"
      { new: true }
    );

    if (!updatedVendeur) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json({
      message: "Poultry trade request submitted",
      statutdemandevolaille: updatedVendeur.statutdemandevolaille,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};