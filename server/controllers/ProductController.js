import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";



// function for add product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
    const userId = req.body.userId;

    // Validate required fields
    if (!name || !description || !price || !category || !subCategory || !sizes) {
      return res.status(400).json({
        success: false,
        message: "All fields are required except bestseller"
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required"
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products" // Optional: organize images in a folder
    });

    const newProduct = new productModel({
      name,
      description,
      price,
      image: {
        public_id: result.public_id,
        url: result.secure_url
      },
      category,
      subCategory,
      sizes,
      bestseller: bestseller || false,
      userId
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct
    });
  } catch (error) {
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
    
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: req.body },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
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

// Get bestseller products
export const getBestsellerProducts = async (req, res) => {
  try {
    const products = await productModel.find({ bestseller: true });
    
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