import express from 'express';
import {
  getNewestAdministration,
  updateAdministration,
  getTypeMarche,
  getCategorieProduitMarche,
  getProduits,
  getProduitTarifsParkillo,
  getTypeDesVendeurs,
  getTypeDesProducteurs,
  getAdministrationHistory,
  getProduitParCategorie
} from '../controllers/administrationController.js';

const administrationrouter = express.Router();

// Get the newest administration record
administrationrouter.get('/', getNewestAdministration);

administrationrouter.get('/history', getAdministrationHistory);
// Update administration record
administrationrouter.post('/', updateAdministration);

// Get typeMarche
administrationrouter.get('/type-marche', getTypeMarche);
administrationrouter.post('/produitparcategorie', getProduitParCategorie);
// Get categorieProduitMarche
administrationrouter.get('/categories-produits', getCategorieProduitMarche);

// Get produits
administrationrouter.get('/produits', getProduits);

// Get produitTarifsParkillo
administrationrouter.get('/tarifs-parkillo', getProduitTarifsParkillo);

// Get typeDesVendeurs
administrationrouter.get('/types-vendeurs', getTypeDesVendeurs);

// Get typeDesProducteurs
administrationrouter.get('/types-producteurs', getTypeDesProducteurs);

export default administrationrouter;