import MandatModel from '../models/mandatModel.js';
import axios from 'axios';

// Create a new mandat
export const createMandat = async (req, res) => {
  try {
    const { VendeurID, PRODUCTEURid, Percentage, Productid, Description } = req.body;
    
    // Validate required fields
    if (!VendeurID || !PRODUCTEURid || !Percentage || !Productid || !Description) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields (VendeurID, PRODUCTEURid, Percentage, Productid, Description) are required' 
      });
    }

    // Check if a mandat already exists for this product between these parties
    const existingMandat = await MandatModel.findOne({ 
      VendeurID, 
      PRODUCTEURid,
      Productid
    });
    
    if (existingMandat) {
      return res.status(400).json({ 
        success: false, 
        message: 'A mandat already exists for this product between these parties' 
      });
    }

    const newMandat = new MandatModel({
      VendeurID,
      PRODUCTEURid,
      Percentage,
      Productid,
      Description,
    });

    const savedMandat = await newMandat.save();
    res.status(201).json({ success: true, mandat: savedMandat });
  } catch (error) {
    console.error('Error creating mandat:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create mandat', 
      error: error.message 
    });
  }
};

// Update mandat status
export const updateMandatStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statutoffre } = req.body;

    // Validate status
    const validStatuses = ['waiting', 'accepted', 'rejected'];
    if (!statutoffre || !validStatuses.includes(statutoffre)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid status (waiting, accepted, rejected) is required' 
      });
    }

    const mandat = await MandatModel.findById(id);
    if (!mandat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mandat not found' 
      });
    }

    mandat.statutoffre = statutoffre;
    const updatedMandat = await mandat.save();

    // Additional business logic when status changes
    if (statutoffre === 'accepted') {
      try {
        // Example: Update product status or notify parties
        await axios.put(`${process.env.PRODUCT_SERVICE_URL}/products/${mandat.Productid}`, {
          status: 'under_mandat',
          mandatId: mandat._id
        });
      } catch (apiError) {
        console.error('Error updating product status:', apiError);
        // Continue even if the update fails
      }
    }

    res.status(200).json({ success: true, mandat: updatedMandat });
  } catch (error) {
    console.error('Error updating mandat status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update mandat status', 
      error: error.message 
    });
  }
};

// Get mandats by product ID
export const getMandatsByProduct = async (req, res) => {
  try {
    const { Productid } = req.params;
    const mandats = await MandatModel.find({ Productid });

    if (!mandats || mandats.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No mandats found for this product' 
      });
    }

    res.status(200).json({ success: true, mandats });
  } catch (error) {
    console.error('Error fetching mandats by product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch mandats for this product', 
      error: error.message 
    });
  }
};

// Delete a mandat
export const deleteMandat = async (req, res) => {
  try {
    const { id } = req.params;
    const mandat = await MandatModel.findByIdAndDelete(id);

    if (!mandat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mandat not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Mandat deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting mandat:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete mandat', 
      error: error.message 
    });
  }
};

// Get mandats by seller ID
export const getMandatsBySeller = async (req, res) => {
  try {
    const { VendeurID } = req.params;
    const mandats = await MandatModel.find({ VendeurID });

    if (!mandats || mandats.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No mandats found for this seller' 
      });
    }

    res.status(200).json({ success: true, mandats });
  } catch (error) {
    console.error('Error fetching mandats by seller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch mandats', 
      error: error.message 
    });
  }
};

// Get mandats by producer ID
export const getMandatsByProducer = async (req, res) => {
  try {
    const { PRODUCTEURid } = req.params;
    const mandats = await MandatModel.find({ PRODUCTEURid });

    if (!mandats || mandats.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No mandats found for this producer' 
      });
    }

    res.status(200).json({ success: true, mandats });
  } catch (error) {
    console.error('Error fetching mandats by producer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch mandats', 
      error: error.message 
    });
  }
};

// Get mandat by ID
export const getMandatById = async (req, res) => {
  try {
    const { id } = req.params;
    const mandat = await MandatModel.findById(id);

    if (!mandat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mandat not found' 
      });
    }

    res.status(200).json({ success: true, mandat });
  } catch (error) {
    console.error('Error fetching mandat:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch mandat', 
      error: error.message 
    });
  }
};