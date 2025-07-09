// stockstockRouter.js

import express from 'express';
import {
  createStock,
  getAllStocks,
  getStockById,
  getStockByUserId,
  getStockByStockeurId,
  updateStock,
  deleteStock,
} from '../controllers/stockController.js'; // Assuming stockController.js is in the same directory

/**
 * @file stockstockRouter.js
 * @description Defines the API routes for stock management.
 * This file sets up the endpoints for creating, reading, updating, and deleting stock items,
 * and also includes routes for fetching stocks by userId and stockeurId.
 */

const stockrouter = express.Router();

// --- Stock API Routes ---

// POST /api/stocks - Create a new stock entry
stockrouter.post('/', createStock);

// GET /api/stocks - Get all stock entries
stockrouter.get('/', getAllStocks);

// GET /api/stocks/:id - Get a single stock entry by its ID
stockrouter.get('/:id', getStockById);

// GET /api/stocks/user/:userId - Get all stock entries for a specific user
stockrouter.get('/user/:userId', getStockByUserId);

// GET /api/stocks/stockeur/:stockeurId - Get all stock entries for a specific stockeur
stockrouter.get('/stockeur/:stockeurId', getStockByStockeurId);

// PUT /api/stocks/:id - Update an existing stock entry by its ID
stockrouter.put('/:id', updateStock);

// DELETE /api/stocks/:id - Delete a stock entry by its ID
stockrouter.delete('/:id', deleteStock);

export default stockrouter;