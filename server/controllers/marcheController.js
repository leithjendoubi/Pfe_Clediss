import Marche from '../models/marcheModel.js';

// Add a new marché
export const addMarche = async (req, res) => {
  try {
    // Create the new marché with explicit periodeDeTravail defaults
    const newMarche = new Marche({
      ...req.body,
      periodeDeTravail: req.body.periodeDeTravail || [{
        dateDebut: Date.now(),
        dateFin: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000)
      }]
    });

    const savedMarche = await newMarche.save();
    res.status(201).json(savedMarche);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update périodeDeTravail
export const updatePeriodeDeTravail = async (req, res) => {
  try {
    const { id } = req.params;
    const { dateDebut, dateFin } = req.body;

    const updatedMarche = await Marche.findByIdAndUpdate(
      id,
      {
        $set: {
          'periodeDeTravail.0.dateDebut': dateDebut || Date.now(),
          'periodeDeTravail.0.dateFin': dateFin || new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000)
        }
      },
      { new: true }
    );

    if (!updatedMarche) {
      return res.status(404).json({ message: 'Marché not found' });
    }

    res.status(200).json(updatedMarche);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get marchés by categorieMarche
export const getMarcheByCategorie = async (req, res) => {
  try {
    const { categorie } = req.params;
    const marches = await Marche.find({ categorieMarche: categorie });
    res.status(200).json(marches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get produitsAVenir by marché
export const getProduitsAVenirByMarche = async (req, res) => {
  try {
    const { id } = req.params;
    const marche = await Marche.findById(id).select('produitsAVenir nomComplet');
    
    if (!marche) {
      return res.status(404).json({ message: 'Marché not found' });
    }

    res.status(200).json({
      marcheName: marche.nomComplet,
      produitsAVenir: marche.produitsAVenir
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get produits by marché
export const getProduitsParMarche = async (req, res) => {
  try {
    const { id } = req.params;
    const marche = await Marche.findById(id).select('produits nomComplet');
    
    if (!marche) {
      return res.status(404).json({ message: 'Marché not found' });
    }

    res.status(200).json({
      marcheName: marche.nomComplet,
      produits: marche.produits
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all marches
export const getAllMarches = async (req, res) => {
  try {
    const marches = await Marche.find({})
      .select('-__v') // Exclude version key
      .lean(); // Convert to plain JavaScript object
    
    // Optional: Format the dates and remove subdocument _ids
    const formattedMarches = marches.map(marche => {
      const formatted = { ...marche };
      
      // Format periodeDeTravail if it exists
      if (formatted.periodeDeTravail && formatted.periodeDeTravail.length > 0) {
        formatted.periodeDeTravail = formatted.periodeDeTravail.map(period => ({
          dateDebut: period.dateDebut.toISOString().split('T')[0], // YYYY-MM-DD format
          dateFin: period.dateFin.toISOString().split('T')[0],
          // _id is automatically included unless you disable it in schema
        }));
      }
      
      // Format timestamps
      formatted.createdAt = formatted.createdAt.toISOString();
      formatted.updatedAt = formatted.updatedAt.toISOString();
      
      return formatted;
    });

    res.status(200).json(formattedMarches);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching marches',
      error: error.message 
    });
  }
};