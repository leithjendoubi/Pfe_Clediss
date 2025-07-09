import Producteur from "../models/producteurModel.js"
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Document types mapping (English keys to Arabic names)
const DOCUMENT_TYPES = {
  FARMERS_UNION_FORM: "مطبوعة يقع سحبها من مكاتب الإتحاد الفلاحي",
  APPLICANT_STATUS_CERTIFICATE: "شهادة مسلمة تثبت صفة الطالب",
  ID_CARD_COPY: "نسخة بطاقة التعريف للطالب أو الممثل القانوني",
  POULTRY_TRADE_PERMIT: "تصريح في تجارة توزيع الدواجن و منتجاتها",
  FERTILIZER_TRADE_PERMIT: "تصريح في تجارة توزيع الأسمدة الكيميائية",
  STORAGE_CERTIFICATE: "شهادة فنية في إمتلاك مخزن موافق لمعايير وزارة التجارة"
};

export const addProducteur = async (req, res) => {
  try {
    const {
      numeroPhone,
      adressProfessionnel,
      categorieProduitMarche,
      nometprenomlegal,
      adressDeStockage,
      typeDesProducteurs
    } = req.body;
    const userId = req.body.userId;
    // Basic field validation
    if (!userId || !numeroPhone || !adressProfessionnel || 
        !categorieProduitMarche || !nometprenomlegal || !typeDesProducteurs) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for existing producteur
    const existingProducteur = await Producteur.findOne({ userId });
    if (existingProducteur) {
      return res.status(400).json({ message: "Producteur already exists for this user" });
    }

    // Process documents
    const documentsMap = {};
    
    if (req.files) {
      for (const [fieldName, files] of Object.entries(req.files)) {
        const file = files[0]; // Take first file if multiple uploaded
        const arabicName = DOCUMENT_TYPES[fieldName] || fieldName;

        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "producteur_documents",
            resource_type: "auto"
          });

          documentsMap[fieldName] = {
            url: result.secure_url,
            public_id: result.public_id,
            title: arabicName, // Store Arabic title here
            uploadedAt: new Date()
          };

          fs.unlinkSync(file.path); // Clean up file
        } catch (uploadError) {
          console.error(`Failed to upload ${fieldName}:`, uploadError);
          // Continue with other documents even if one fails
        }
      }
    }

    // Create producteur
    const newProducteur = new Producteur({
      userId,
      numeroPhone,
      adressProfessionnel,
      categorieProduitMarche,
      nometprenomlegal,
      typeDesProducteurs,
      documents: documentsMap,
      adressDeStockage: adressDeStockage || ""
    });

    await newProducteur.save();
    res.status(201).json({
      ...newProducteur.toObject(),
      message: "Producteur created successfully"
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
      message: "Error creating producteur",
      error: error.message 
    });
  }
};

export const deleteProducteur = async (req, res) => {
  try {
    const { producteurId } = req.params;

    const producteur = await Producteur.findOneAndDelete({ _id: producteurId });

    if (!producteur) {
      return res.status(404).json({ message: "Producteur not found" });
    }

    res.status(200).json({ message: "Producteur deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting Producteur",
      error: error.message 
    });
  }
};

export const stopProducteur = async (req, res) => {
  try {
    const { producteurId } = req.params;

    const producteur = await Producteur.findOneAndUpdate(
      { _id: producteurId },
      { $set: { statutdemande: "arrêter" } },
      { new: true }
    );

    if (!producteur) {
      return res.status(404).json({ message: "Producteur not found" });
    }

    res.status(200).json({ message: "Producteur stopped successfully", producteur });
  } catch (error) {
    res.status(500).json({ 
      message: "Error stopping Producteur",
      error: error.message 
    });
  }
};

// Accept producteur demande (set statutdemande to "مقبول")
export const acceptStatutDemande = async (req, res) => {
  try {
    const { producteurId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(producteurId)) {
      return res.status(400).json({ message: "Invalid producteur ID" });
    }

    const updatedProducteur = await Producteur.findByIdAndUpdate(
      producteurId,
      { statutdemande: "مقبول" },
      { new: true }
    );

    if (!updatedProducteur) {
      return res.status(404).json({ message: "Producteur not found" });
    }

    res.json(updatedProducteur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refuse producteur demande
export const refusStatutDemande = async (req, res) => {
  try {
    const { producteurId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(producteurId)) {
      return res.status(400).json({ message: "Invalid producteur ID" });
    }

    const updatedProducteur = await Producteur.findByIdAndUpdate(
      producteurId,
      { statutdemande: `مرفوض: ${reason}` },
      { new: true }
    );

    if (!updatedProducteur) {
      return res.status(404).json({ message: "Producteur not found" });
    }

    res.json(updatedProducteur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Get producteur statuses by userId
export const userIsProducteur = async (req, res) => {
  try {
    const { userId } = req.params;

    const producteur = await Producteur.findOne({ userId });

    if (!producteur) {
      return res.status(404).json({ message: "Producteur not found for this user" });
    }

    // Return true if statutdemande is "مقبول", false otherwise
    const isProducteur = producteur.statutdemande === "مقبول";

    res.json(isProducteur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getProducteurDataByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const producteur = await Producteur.findOne({ userId });

    if (!producteur) {
      return res.status(404).json({ message: "Producteur not found for this user" });
    }

    // Return all relevant producteur data
    const producteurData = {
      userId: producteur.userId,
      numeroPhone: producteur.numeroPhone,
      adressProfessionnel: producteur.adressProfessionnel,
      categorieProduitMarche: producteur.categorieProduitMarche,
      typeDesProducteurs: producteur.typeDesProducteurs,
      nometprenomlegal: producteur.nometprenomlegal,
      documents: producteur.documents,
      adressDeStockage: producteur.adressDeStockage,
      statutdemande: producteur.statutdemande,
      createdAt: producteur.createdAt,
      updatedAt: producteur.updatedAt
    };

    res.json(producteurData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};












export const getDemandProducteurs = async (req, res) => {
  try {
    const pendingProducteurs = await Producteur.find({ 
      statutdemande: "في المعالجة" 
    });

    // Always return 200, with empty array if none found
    res.status(200).json(pendingProducteurs || []);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching pending producteurs",
      error: error.message 
    });
  }
};


export const getAllProducers = async (req, res) => {
  try {
    const allProducteurs = await Producteur.find({});
    
    res.status(200).json(allProducteurs || []);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching all producteurs",
      error: error.message 
    });
  }
};


export const getDemandProducteursaccepted = async (req, res) => {
  try {
    const acceptedProducteurs = await Producteur.find({ 
      statutdemande: "مقبول" 
    });

    // Always return 200 with an array (empty if no results)
    res.status(200).json(acceptedProducteurs || []);
    
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching accepted producteurs",
      error: error.message 
    });
  }
};