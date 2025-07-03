import OffreModel from '../models/offreModel.js';
import axios from 'axios';

// Add a new offer
export const addOffre = async (req, res) => {
  try {
    const { userId, typeoffre, pricepardinar, ordreId } = req.body;
    
    // Validate required fields
    if (!userId || !typeoffre || !pricepardinar || !ordreId) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if an offer already exists for this order
    const existingOffre = await OffreModel.findOne({ ordreId });
    if (existingOffre) {
      return res.status(400).json({ success: false, message: 'An offer already exists for this order' });
    }

    const newOffre = new OffreModel({
      userId,
      typeoffre,
      pricepardinar,
      ordreId,
    });

    const savedOffre = await newOffre.save();
    res.status(201).json({ success: true, offre: savedOffre });
  } catch (error) {
    console.error('Error adding offer:', error);
    res.status(500).json({ success: false, message: 'Failed to add offer', error: error.message });
  }
};

// Update offer status by order ID
export const updateStatutOffreByOrderID = async (req, res) => {
  try {
    const { ordreId } = req.params;
    const { statutoffre } = req.body;

    // Validate status
    const validStatuses = ['waiting', 'accepted', 'rejected'];
    if (!statutoffre || !validStatuses.includes(statutoffre)) {
      return res.status(400).json({ success: false, message: 'Valid status is required' });
    }

    const offre = await OffreModel.findOne({ ordreId });
    if (!offre) {
      return res.status(404).json({ success: false, message: 'Offer not found for this order' });
    }

    offre.statutoffre = statutoffre;
    const updatedOffre = await offre.save();

    // If status is 'accepted', call the affectLivreurId API
    if (statutoffre === 'accepted') {
      try {
        await axios.put(`${process.env.ORDER_API_URL || 'http://localhost:4000'}/api/order/affect-livreur/${ordreId}`, {
          livreurId: offre.userId,
        });
      } catch (apiError) {
        console.error('Error assigning livreur:', apiError);
        return res.status(500).json({ 
          success: false, 
          message: 'Offer updated but failed to assign livreur', 
          error: apiError.message 
        });
      }
    }

    res.status(200).json({ success: true, offre: updatedOffre });
  } catch (error) {
    console.error('Error updating offer status:', error);
    res.status(500).json({ success: false, message: 'Failed to update offer status', error: error.message });
  }
};

// Delete an offer
export const deleteOffre = async (req, res) => {
  try {
    const { id } = req.params;
    const offre = await OffreModel.findByIdAndDelete(id);

    if (!offre) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    res.status(200).json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ success: false, message: 'Failed to delete offer', error: error.message });
  }
};

// Get offers by order ID
export const getOffresByOrderID = async (req, res) => {
  try {
    const { ordreId } = req.params;
    const offres = await OffreModel.find({ ordreId });

    if (!offres || offres.length === 0) {
      return res.status(404).json({ success: false, message: 'No offers found for this order' });
    }

    res.status(200).json({ success: true, offres });
  } catch (error) {
    console.error('Error fetching offers by order ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch offers', error: error.message });
  }
};

// Get offers by user ID
export const getOffreByUserID = async (req, res) => {
  try {
    const { userId } = req.params;
    const offres = await OffreModel.find({ userId });

    if (!offres || offres.length === 0) {
      return res.status(404).json({ success: false, message: 'No offers found for this user' });
    }

    res.status(200).json({ success: true, offres });
  } catch (error) {
    console.error('Error fetching offers by user ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch offers', error: error.message });
  }
};