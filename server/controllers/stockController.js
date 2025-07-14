import StockModel from '../models/stockModel.js';
import mongoose from 'mongoose';

// Create new stock entry
export const createStockEntry = async (req, res) => {
  try {
    const { userId, equipementId, dateentre, datesortie, produitid, poidsastocker } = req.body;

    // Validate required fields
    if (!userId || !equipementId || !dateentre || !datesortie) {
      return res.status(400).json({
        success: false,
        message: 'userId, equipementId, dateentre, and datesortie are required fields'
      });
    }

    // Validate dates
    if (new Date(datesortie) <= new Date(dateentre)) {
      return res.status(400).json({
        success: false,
        message: 'datesortie must be after dateentre'
      });
    }

    const newStock = new StockModel({
      userId,
      equipementId,
      dateentre: new Date(dateentre),
      datesortie: new Date(datesortie),
      produitid,
      poidsastocker
    });

    const savedStock = await newStock.save();
    
    res.status(201).json({
      success: true,
      message: 'Stock entry created successfully',
      data: savedStock
    });

  } catch (error) {
    console.error('Error creating stock entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create stock entry',
      error: error.message
    });
  }
};

// Get stock entries by user ID (returns empty array if none found)
export const getStockByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const stockEntries = await StockModel.find({ userId })
      .sort({ datedecreation: -1 });

    res.status(200).json({
      success: true,
      count: stockEntries.length,
      data: stockEntries
    });

  } catch (error) {
    console.error('Error fetching stock by user ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock entries',
      error: error.message
    });
  }
};

// Get stock entries by stockeur ID (returns empty array if none found)
export const getStockByStockeurId = async (req, res) => {
  try {
    const { stockeurId } = req.params;
    
    const stockEntries = await StockModel.find({ userId: stockeurId }) // Assuming stockeurId maps to userId
      .sort({ datedecreation: -1 });

    res.status(200).json({
      success: true,
      count: stockEntries.length,
      data: stockEntries
    });

  } catch (error) {
    console.error('Error fetching stock by stockeur ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock entries',
      error: error.message
    });
  }
};

// Update stock entry status
export const updateStockStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusdedamnd } = req.body;

    // Validate status
    const validStatuses = ['en traitement', 'approuvé', 'rejeté', 'terminé'];
    if (!statusdedamnd || !validStatuses.includes(statusdedamnd)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (en traitement, approuvé, rejeté, terminé)'
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock ID format'
      });
    }

    const updatedStock = await StockModel.findByIdAndUpdate(
      id,
      { statusdedamnd },
      { new: true, runValidators: true }
    );

    if (!updatedStock) {
      return res.status(404).json({
        success: false,
        message: 'Stock entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock status updated successfully',
      data: updatedStock
    });

  } catch (error) {
    console.error('Error updating stock status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock status',
      error: error.message
    });
  }
};

// Get all stock entries for a user
export const getUserStockEntries = async (req, res) => {
  try {
    const { userId } = req.params;

    const stockEntries = await StockModel.find({ userId })
      .sort({ datedecreation: -1 });

    res.status(200).json({
      success: true,
      count: stockEntries.length,
      data: stockEntries
    });

  } catch (error) {
    console.error('Error fetching user stock entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock entries',
      error: error.message
    });
  }
};

// Get stock entry by ID
export const getStockEntryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock ID format'
      });
    }

    const stockEntry = await StockModel.findById(id);

    if (!stockEntry) {
      return res.status(404).json({
        success: false,
        message: 'Stock entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: stockEntry
    });

  } catch (error) {
    console.error('Error fetching stock entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock entry',
      error: error.message
    });
  }
};

// Get stock entries by equipment
export const getEquipmentStockEntries = async (req, res) => {
  try {
    const { equipementId } = req.params;
    const { startDate, endDate } = req.query;

    let query = { equipementId };

    // Add date filtering if provided
    if (startDate && endDate) {
      query.dateentre = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const entries = await StockModel.find(query)
      .sort({ dateentre: 1 });

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries
    });

  } catch (error) {
    console.error('Error fetching equipment stock entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch equipment stock entries',
      error: error.message
    });
  }
};

// Delete stock entry
export const deleteStockEntry = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock ID format'
      });
    }

    const deletedEntry = await StockModel.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message: 'Stock entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock entry deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting stock entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete stock entry',
      error: error.message
    });
  }
};

// Update stock entry details
export const updateStockEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock ID format'
      });
    }

    // Prevent status update through this endpoint
    if (updateData.statusdedamnd) {
      return res.status(400).json({
        success: false,
        message: 'Use the dedicated status endpoint to update status'
      });
    }

    // Validate dates if both are provided
    if (updateData.dateentre && updateData.datesortie) {
      if (new Date(updateData.datesortie) <= new Date(updateData.dateentre)) {
        return res.status(400).json({
          success: false,
          message: 'datesortie must be after dateentre'
        });
      }
    }

    const updatedEntry = await StockModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({
        success: false,
        message: 'Stock entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock entry updated successfully',
      data: updatedEntry
    });

  } catch (error) {
    console.error('Error updating stock entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock entry',
      error: error.message
    });
  }
};