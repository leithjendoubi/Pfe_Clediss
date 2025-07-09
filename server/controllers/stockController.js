// stockController.js

import stockModel from '../models/stockModel.js'; // Assuming stockModel.js is in the same directory

/**
 * @file stockController.js
 * @description Controller for managing stock operations.
 * This file provides functions to handle CRUD (Create, Read, Update, Delete) operations
 * for stock items using the stockModel.
 */

// --- Create Operations ---

/**
 * Creates a new stock entry.
 * @param {Object} req - The request object, containing the stock data in req.body.
 * @param {Object} res - The response object.
 */
export const createStock = async (req, res) => {
  try {
    const newStock = new stockModel(req.body);
    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    console.error("Error creating stock:", error);
    res.status(500).json({ message: "Failed to create stock", error: error.message });
  }
};

// --- Read Operations ---

/**
 * Retrieves all stock entries.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await stockModel.find({});
    res.status(200).json(stocks);
  } catch (error) {
    console.error("Error fetching all stocks:", error);
    res.status(500).json({ message: "Failed to retrieve stocks", error: error.message });
  }
};

/**
 * Retrieves a single stock entry by its ID.
 * @param {Object} req - The request object, containing the stock ID in req.params.id.
 * @param {Object} res - The response object.
 */
export const getStockById = async (req, res) => {
  try {
    const stock = await stockModel.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.status(200).json(stock);
  } catch (error) {
    console.error("Error fetching stock by ID:", error);
    res.status(500).json({ message: "Failed to retrieve stock", error: error.message });
  }
};

/**
 * Retrieves stock entries by userId.
 * @param {Object} req - The request object, containing the userId in req.params.userId.
 * @param {Object} res - The response object.
 */
export const getStockByUserId = async (req, res) => {
  try {
    const stocks = await stockModel.find({ userId: req.params.userId });
    if (stocks.length === 0) {
      return res.status(404).json({ message: "No stocks found for this user ID" });
    }
    res.status(200).json(stocks);
  } catch (error) {
    console.error("Error fetching stocks by user ID:", error);
    res.status(500).json({ message: "Failed to retrieve stocks by user ID", error: error.message });
  }
};

/**
 * Retrieves stock entries by stockeurId.
 * @param {Object} req - The request object, containing the stockeurId in req.params.stockeurId.
 * @param {Object} res - The response object.
 */
export const getStockByStockeurId = async (req, res) => {
  try {
    const stocks = await stockModel.find({ stockeurId: req.params.stockeurId });
    if (stocks.length === 0) {
      return res.status(200).json({ message: "No stocks found for this stockeur ID" });
    }
    res.status(200).json(stocks);
  } catch (error) {
    console.error("Error fetching stocks by stockeur ID:", error);
    res.status(500).json({ message: "Failed to retrieve stocks by stockeur ID", error: error.message });
  }
};

// --- Update Operations ---

/**
 * Updates an existing stock entry.
 * @param {Object} req - The request object, containing the stock ID in req.params.id and update data in req.body.
 * @param {Object} res - The response object.
 */
export const updateStock = async (req, res) => {
  try {
    const updatedStock = await stockModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators: true` runs schema validators on update
    );
    if (!updatedStock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.status(200).json(updatedStock);
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Failed to update stock", error: error.message });
  }
};

// --- Delete Operations ---

/**
 * Deletes a stock entry.
 * @param {Object} req - The request object, containing the stock ID in req.params.id.
 * @param {Object} res - The response object.
 */
export const deleteStock = async (req, res) => {
  try {
    const deletedStock = await stockModel.findByIdAndDelete(req.params.id);
    if (!deletedStock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({ message: "Failed to delete stock", error: error.message });
  }
};