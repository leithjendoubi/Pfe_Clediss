import AdministrationModel from '../models/administrationModel.js';

// Get the newest administration record
export const getNewestAdministration = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update administration record
export const updateAdministration = async (req, res) => {
  try {
    // Get the newest record first to set as oldDate
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    
    const updatedAdmin = await AdministrationModel.create({
      ...req.body,
      oldDate: newestAdmin ? newestAdmin.newDate : null
    });

    res.status(201).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get typeMarche
export const getTypeMarche = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin.typeMarche);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get categorieProduitMarche
export const getCategorieProduitMarche = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin.categorieProduitMarche);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get produits
export const getProduits = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin.produits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get produitTarifsParkillo
export const getProduitTarifsParkillo = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin.produitTarifsParkillo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get typeDesVendeurs
export const getTypeDesVendeurs = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin.typeDesVendeurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get typeDesProducteurs
export const getTypeDesProducteurs = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin.typeDesProducteurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Initialize the database with default administration data if empty
export const initializeAdministration = async () => {
  try {
    const count = await AdministrationModel.countDocuments();
    
    if (count === 0) {
      const initialAdmin = new AdministrationModel({
        typeMarche: ["إنتاج", "الجملة", "ذات مصلحة وطنية"],
        categorieProduitMarche: [
          "باكورات",
          "قوارص",
          "التمور", 
          "الزيتون",
          "بقول الجافة",
          "خضر و غلال",
          "صيد البحري",
          "أسمدة فلاحية",
          "لحوم حمراء و منتوجات حيوانية",
          "دواجن و منتوجاتها"
        ],
        produits: [
          ["باكورات", ["فراولة", "فول أخضر", "بصل أخضر", "بطاطا جديدة"]],
          ["قوارص", ["برتقال مالتا", "كليمونتين", "لّيم", "بُرْتُقال أبوصرة"]],
          ["التمور", ["دقلة النور", "العليق", "الكنتي", "المجدول"]],
          ["الزيتون", ["زيتون الشملالي", "زيتون السوسي", "زيت زيتونة شملالي", "زيت زيتون عضوي"]],
          ["البقول الجافة", ["عدس", "حمص", "فول يابس", "لوبيا"]],
          ["الخضر و الغلال", [
            "طماطم", "فلفل", "بصل", "بطيخ", "مشمش", "خوخ", "رمان",
            "فلفل حلو", "فلفل حار", "بصل يابس", "ثوم", "بطاطا", "جزر"
          ]],
          ["صيد البحري", ["سردينة", "ورقة", "قرنيط", "تنّ", "جمبري"]],
          ["لحوم حمراء و منتوجات حيوانية", ["لحم غنم", "لحم بقري", "حليب طازج", "جبن عربي", "لبن"]],
          ["أسمدة فلاحية", ["الأمونيترات", "ثلاثي الفسفاط الرفيع", "ثاني أمونيا الفسفاط", "الأسمدة المركبة"]],
          ["دواجن و منتوجاتها", ["بيض", "لحوم بيضاء"]]
        ],
        produitTarifsParkillo: [["كيوي", 10], ["تمر", 20]],
        typeDesProducteurs: ["منتج", "شركة إنتاج", "تجمع إنتاجي"],
        typeDesVendeurs: ["وكيل بيع بالجملة", "مورد", "بائع بالتفصيل", "مجمع إنتاج"]
      });

      await initialAdmin.save();
      console.log("Initial administration data created successfully");
      return initialAdmin;
    } else {
      console.log("Administration data already exists");
      return null;
    }
  } catch (error) {
    console.error("Error initializing administration data:", error);
    throw error;
  }
};