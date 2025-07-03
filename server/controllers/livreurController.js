import { v2 as cloudinary } from "cloudinary";
import livreurModel from "../models/livreurModel.js";

export const addDemande = async (req, res) => {
  try {
    const { userId, telephone } = req.body;

    // Validate required fields
    if (!userId || !telephone) {
      return res.status(400).json({
        success: false,
        message: "UserId and telephone are required"
      });
    }

    // Check if file was uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Documents are required"
      });
    }

    // Check if exactly 3 documents are uploaded (carte grise, carte cin, form signé)
    if (req.files.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "Please upload all 3 required documents: carte grise, carte cin, and signed form"
      });
    }

    // Upload documents to Cloudinary
    const uploadPromises = req.files.map(file => 
      cloudinary.uploader.upload(file.path, { folder: "Document" })
    );

    const results = await Promise.all(uploadPromises);
    const documentUrls = results.map(result => result.secure_url);

    // Create new livreur demande
    const newLivreur = new livreurModel({
      userId,
      documents: documentUrls,
      telephone: parseInt(telephone),
      // Other fields will use their default values
    });

    await newLivreur.save();

    return res.status(201).json({
      success: true,
      message: "Demande created successfully",
      data: newLivreur
    });

  } catch (error) {
    console.error("Error creating demande:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


export const getalllivreur = async (req, res) => {
  try {
    const livreurs = await livreurModel.find();
    res.status(200).json({
      success: true,
      message: "All livreurs retrieved successfully",
      data: livreurs
    });
  } catch (error) {
    console.error("Error getting all livreurs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get livreurs with "en train de traité" status
export const getlivreurdemande = async (req, res) => {
  try {
    const livreurs = await livreurModel.find({ statutDemande: "en train de traité" });
    res.status(200).json({
      success: true,
      message: "Pending livreur demands retrieved successfully",
      data: livreurs
    });
  } catch (error) {
    console.error("Error getting pending livreur demands:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Accept a livreur demand
export const acceptdemande = async (req, res) => {
  try {

    const { livreurId,citeprincipale, VolumeDisponibleParDefaut, poidsMaximale } = req.body;

    if (!citeprincipale || !VolumeDisponibleParDefaut || !poidsMaximale) {
      return res.status(400).json({
        success: false,
        message: "All fields (citeprincipale, VolumeDisponibleParDefaut, poidsMaximale) are required"
      });
    }

    const updatedLivreur = await livreurModel.findByIdAndUpdate(
      livreurId,
      {
        citeprincipale,
        VolumeDisponibleParDefaut: Number(VolumeDisponibleParDefaut),
        poidsMaximale: Number(poidsMaximale),
        statutDemande: "Accepté"
      },
      { new: true }
    );

    if (!updatedLivreur) {
      return res.status(404).json({
        success: false,
        message: "Livreur not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Livreur demand accepted successfully",
      data: updatedLivreur
    });
  } catch (error) {
    console.error("Error accepting livreur demand:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get accepted livreurs
export const getlivreuraccepte = async (req, res) => {
  try {
    const livreurs = await livreurModel.find({ statutDemande: "Accepté" });
    res.status(200).json({
      success: true,
      message: "Accepted livreurs retrieved successfully",
      data: livreurs
    });
  } catch (error) {
    console.error("Error getting accepted livreurs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Reject a livreur demand (additional useful method)
export const rejectdemande = async (req, res) => {
  try {
    const { livreurId } = req.body;

    const updatedLivreur = await livreurModel.findByIdAndUpdate(
      livreurId,
      { statutDemande: "Rejeté" },
      { new: true }
    );

    if (!updatedLivreur) {
      return res.status(404).json({
        success: false,
        message: "Livreur not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Livreur demand rejected successfully",
      data: updatedLivreur
    });
  } catch (error) {
    console.error("Error rejecting livreur demand:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};



export const getLivreurByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required"
      });
    }

    // Find livreur by userId
    const livreur = await livreurModel.findOne({ userId });

    if (!livreur) {
      return res.status(404).json({
        success: false,
        message: "Livreur not found for this user"
      });
    }

    res.status(200).json({
      success: true,
      message: "Livreur retrieved successfully",
      data: livreur
    });

  } catch (error) {
    console.error("Error getting livreur by userId:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


export const updateLivreurProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      citeprincipale,
      VolumeDisponibleParDefaut,
      poidsMaximale,
      telephone
    } = req.body;

    // Validate userId exists
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required"
      });
    }

    // Prepare update fields (exclude documents and other non-updatable fields)
    const updateFields = {};
    if (citeprincipale) updateFields.citeprincipale = citeprincipale;
    if (VolumeDisponibleParDefaut) updateFields.VolumeDisponibleParDefaut = Number(VolumeDisponibleParDefaut);
    if (poidsMaximale) updateFields.poidsMaximale = Number(poidsMaximale);
    if (telephone) updateFields.telephone = Number(telephone);

    // Update livreur profile
    const updatedLivreur = await livreurModel.findOneAndUpdate(
      { userId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedLivreur) {
      return res.status(404).json({
        success: false,
        message: "Livreur not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedLivreur
    });

  } catch (error) {
    console.error("Error updating livreur profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};