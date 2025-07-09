import Stockiste from '../models/stockisteModel.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { promises as fs } from 'fs';

const DOCUMENT_TYPES = {
  TAX_NUMBER: 'رقم جبائي',
  MUNICIPAL_OPERATING_LICENSE: 'رخصة إستغلال مسلمة من البلدية',
  TECHNICAL_CERTIFICATE: 'شهادة فنية',
  COMMERCIAL_REGISTRATION: 'التسجيل التجاري',
};

export const addStockiste = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    const {
      userId,
      numeroPhone,
      addressProfessionelle, // Updated
      nomlegal, // Updated
      typedestockage, // Updated
      statusdedamnd, // Updated
    } = req.body;

    // Validate required fields
    if (!userId || !numeroPhone || !addressProfessionelle || !nomlegal) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for existing stockiste
    const existingStockiste = await Stockiste.findOne({ userId });
    if (existingStockiste) {
      return res.status(400).json({ message: 'Stockiste already exists for this user' });
    }

    // Process documents
    const documentsMap = {};
    if (req.files && Object.keys(req.files).length > 0) {
      for (const [fieldName, files] of Object.entries(req.files)) {
        const file = files[0];
        const arabicName = DOCUMENT_TYPES[fieldName] || fieldName;
        try {
          console.log(`Uploading ${fieldName} to Cloudinary:`, file.path);
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'stockiste_documents',
            resource_type: 'auto',
          });
          console.log(`Uploaded ${fieldName}:`, result);
          documentsMap[fieldName] = {
            url: result.secure_url,
            public_id: result.public_id,
            title: arabicName,
            uploadedAt: new Date(),
          };
          await fs.unlink(file.path);
        } catch (uploadError) {
          console.error(`Failed to upload ${fieldName}:`, uploadError);
          throw uploadError; // Stop on upload error
        }
      }
    } else {
      return res.status(400).json({ message: 'At least one document is required' });
    }

    // Create stockiste
    console.log('Creating stockiste with data:', {
      userId,
      numeroPhone,
      addressProfessionelle,
      nomlegal,
      typedestockage,
      statusdedamnd,
      documents: documentsMap,
    });
    const newStockiste = new Stockiste({
      userId,
      numeroPhone,
      addressProfessionelle,
      nomlegal,
      typedestockage: typedestockage || 'waiting',
      statusdedamnd: statusdedamnd || 'en traitement',
      documents: documentsMap,
    });

    await newStockiste.save();
    res.status(201).json({
      id: newStockiste._id,
      userId: newStockiste.userId,
      numeroPhone: newStockiste.numeroPhone,
      documents: newStockiste.documents,
      message: 'Stockiste created successfully',
    });
  } catch (error) {
    console.error('Error in addStockiste:', error);
    if (req.files) {
      for (const files of Object.values(req.files)) {
        for (const file of files) {
          try {
            await fs.unlink(file.path);
          } catch (unlinkError) {
            console.error(`Failed to delete file ${file.path}:`, unlinkError);
          }
        }
      }
    }
    res.status(500).json({
      message: 'Error creating stockiste',
      error: error.message,
    });
  }
};

export const getStockisteDemands = async (req, res) => {
  try {
    const demands = await Stockiste.find({ statusDeDemande: "en traitement" }).select(
      "userId nomEtPrenomLegal numeroPhone adresseProfessionnelle typeDeStockage statusDeDemande documents datedecreation"
    );
    res.status(200).json({
      demands,
      message: "Stockiste demands retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving stockiste demands",
      error: error.message
    });
  }
};

export const acceptDemand = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid stockiste ID" });
    }

    const stockiste = await Stockiste.findByIdAndUpdate(
      id,
      { statusDeDemande: "accepté" },
      { new: true }
    ).select(
      "userId nomEtPrenomLegal numeroPhone adresseProfessionnelle typeDeStockage statusDeDemande"
    );

    if (!stockiste) {
      return res.status(404).json({ message: "Stockiste not found" });
    }

    res.status(200).json({
      stockiste,
      message: "Stockiste demand accepted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error accepting stockiste demand",
      error: error.message
    });
  }
};

export const getAllStockiste = async (req, res) => {
  try {
    const stockistes = await Stockiste.find().select(
      "userId nomEtPrenomLegal numeroPhone adresseProfessionnelle typeDeStockage statusDeDemande documents datedecreation"
    );
    res.status(200).json({
      stockistes,
      message: "All stockistes retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving stockistes",
      error: error.message
    });
  }
};

export const suspenderStockiste = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid stockiste ID" });
    }

    const stockiste = await Stockiste.findByIdAndUpdate(
      id,
      { statusDeDemande: "suspended" },
      { new: true }
    ).select(
      "userId nomEtPrenomLegal numeroPhone adresseProfessionnelle typeDeStockage statusDeDemande"
    );

    if (!stockiste) {
      return res.status(404).json({ message: "Stockiste not found" });
    }

    res.status(200).json({
      stockiste,
      message: "Stockiste suspended successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error suspending stockiste",
      error: error.message
    });
  }
};

export const getAcceptedStockiste = async (req, res) => {
  try {
    const stockistes = await Stockiste.find({ statusDeDemande: "accepté" }).select(
      "userId nomEtPrenomLegal numeroPhone adresseProfessionnelle typeDeStockage statusDeDemande documents datedecreation"
    );
    res.status(200).json({
      stockistes,
      message: "Accepted stockistes retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving accepted stockistes",
      error: error.message
    });
  }
};



export const getStockisteByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const stockiste = await Stockiste.findOne({ userId }).select(
      "userId nomEtPrenomLegal numeroPhone adresseProfessionnelle typeDeStockage statusDeDemande documents datedecreation"
    );

    if (!stockiste) {
      return res.status(404).json({ message: "Stockiste not found for this user" });
    }

    res.status(200).json({
      stockiste,
      message: "Stockiste retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving stockiste",
      error: error.message
    });
  }
};