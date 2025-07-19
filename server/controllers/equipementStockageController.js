import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import equipementStockageModel from "../models/equipementStockageModel.js";
import productModel from "../models/productModel.js";

// Create a new equipment
export const createEquipement = async (req, res) => {
  try {
    const { UserId, nom, Poidsdisponibleenkillo, Prixparjour, Prixparkillo, listdesproduits } = req.body;

    // Validate required fields
    if (!UserId || !nom || !Poidsdisponibleenkillo || !Prixparjour || !Prixparkillo) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Check if file was uploaded (image is optional but processed if provided)
    let imageUrl = "";
    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "equipements"
      });
      // Clean up file after upload
      fs.unlinkSync(req.file.path);
      imageUrl = result.secure_url; // Store only the URL as a string
    }

    // Create new equipment instance
    const newEquipement = new equipementStockageModel({
      UserId,
      nom,
      Poidsdisponibleenkillo,
      Poidsstocker: 0, // Default value as per schema
      Prixparjour,
      Prixparkillo,
      listdesproduits: listdesproduits || [], // Default to empty array if not provided
      image: imageUrl, // Store the Cloudinary URL or empty string if no image
      Date: Date.now() // Explicitly set for clarity, though schema default exists
    });

    // Save to database
    const savedEquipement = await newEquipement.save();

    res.status(201).json({
      success: true,
      message: "Equipment created successfully",
      equipement: savedEquipement
    });
  } catch (error) {
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all equipment
export const getAllEquipement = async (req, res) => {
  try {
    const equipements = await equipementStockageModel.find();
    res.status(200).json({
      success: true,
      message: "All equipment retrieved successfully",
      equipements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all equipment by UserId
export const getEquipementByUserId = async (req, res) => {
  try {
    const { UserId } = req.params; // Assuming UserId is passed as a URL parameter
    if (!UserId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required"
      });
    }

    const equipements = await equipementStockageModel.find({ UserId });
    if (!equipements.length) {
      return res.status(404).json({
        success: false,
        message: "No equipment found for this UserId"
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipment retrieved successfully",
      equipements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all available equipment by UserId (Poidsdisponibleenkillo - Poidsstocker > 0)
export const getEquipementByUserIdAvailable = async (req, res) => {
  try {
    const { UserId } = req.params; // Assuming UserId is passed as a URL parameter
    if (!UserId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required"
      });
    }

    const equipements = await equipementStockageModel.find({
      UserId,
      $expr: { $gt: [{ $subtract: ["$Poidsdisponibleenkillo", "$Poidsstocker"] }, 0] }
    });

    if (!equipements.length) {
      return res.status(404).json({
        success: false,
        message: "No available equipment found for this UserId"
      });
    }

    res.status(200).json({
      success: true,
      message: "Available equipment retrieved successfully",
      equipements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add product to equipment stock
export const addProduitStock = async (req, res) => {
  try {
    const { equipementId, productId } = req.body; // Assuming equipementId and productId are provided in the request body
    if (!equipementId || !productId) {
      return res.status(400).json({
        success: false,
        message: "equipementId and productId are required"
      });
    }

    // Find the equipment
    const equipement = await equipementStockageModel.findById(equipementId);
    if (!equipement) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    // Find the product
    const product = await productModel.findById(productId);
    if (!product || !product.availablepoids) {
      return res.status(404).json({
        success: false,
        message: "Product not found or no available weight specified"
      });
    }

    // Check if there's enough available weight in the equipment
    const availableWeight = equipement.Poidsdisponibleenkillo - equipement.Poidsstocker;
    if (availableWeight < product.availablepoids) {
      return res.status(400).json({
        success: false,
        message: "Insufficient available weight in equipment"
      });
    }

    // Update equipment: add productId to listdesproduits and increase Poidsstocker
    equipement.listdesproduits.push(productId);
    equipement.Poidsstocker += product.availablepoids;

    // Save updated equipment
    const updatedEquipement = await equipement.save();

    res.status(200).json({
      success: true,
      message: "Product added to equipment stock successfully",
      equipement: updatedEquipement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Calculate total price based on days and kilos
export const getTotalPrice = async (req, res) => {
  try {
    const { equipementId, days, kilos } = req.body; // Assuming inputs are provided in the request body
    if (!equipementId || days == null || kilos == null) {
      return res.status(400).json({
        success: false,
        message: "equipementId, days, and kilos are required"
      });
    }

    // Validate days and kilos are positive numbers
    if (days <= 0 || kilos <= 0) {
      return res.status(400).json({
        success: false,
        message: "Days and kilos must be positive numbers"
      });
    }

    // Find the equipment
    const equipement = await equipementStockageModel.findById(equipementId);
    if (!equipement) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    // Calculate total price
    const totalPrice = (days * equipement.Prixparjour) + (kilos * equipement.Prixparkillo);

    res.status(200).json({
      success: true,
      message: "Total price calculated successfully",
      totalPrice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
