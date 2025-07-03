import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import fs from "fs";

// Function to add a product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, poidnet, availablepoids, marcheID, userId } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !subCategory || !sizes || !userId) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "A product image is required"
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products"
    });
    // Clean up file after upload
    fs.unlinkSync(req.file.path);

    const newProduct = new productModel({
      name,
      description,
      price,
      image: [{
        public_id: result.public_id,
        url: result.secure_url
      }],
      category,
      subCategory,
      sizes,
      poidnet: poidnet || [],
      availablepoids: availablepoids || [],
      marcheID: marcheID || "aucun marche",
      userId
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct
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

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get products by user (seller)
export const getUserProducts = async (req, res) => {
  try {
    const userId = req.body.userId; // From auth middleware
    const products = await productModel.find({ userId });
    
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const userId = req.body.userId; // From auth middleware
    const productId = req.params.id;
    
    // First find the product to verify ownership
    const product = await productModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    // Check if the user owns this product
    if (product.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this product"
      });
    }

    // Handle image updates if new files are uploaded
    let updatedData = { ...req.body };
    if (req.file && req.files.length > 0) {
      // Upload new images to Cloudinary
      const imageUploads = await Promise.all(
        req.file.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products"
          });
          fs.unlinkSync(file.path);
          return {
            public_id: result.public_id,
            url: result.secure_url
          };
        })
      );
      updatedData.image = imageUploads;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: updatedData },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    // Clean up any remaining files
    if (req.file) {
      req.file.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const userId = req.body.userId; // From auth middleware
    const productId = req.params.id;
    
    // First find the product to verify ownership
    const product = await productModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    // Check if the user owns this product
    if (product.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this product"
      });
    }
    
    // Delete images from Cloudinary
    for (const img of product.image) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    
    await productModel.findByIdAndDelete(productId);
    
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await productModel.find({ category: req.params.category });
    
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get products by marcheID
export const getProductsByMarcheID = async (req, res) => {
  try {
    const products = await productModel.find({ marcheID: req.params.marcheID });
    
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};