import express from 'express';
import {
  addMarche,
  updatePeriodeDeTravail,
  getMarcheByCategorie,
  getProduitsAVenirByMarche,
  getProduitsParMarche,
  getAllMarches,
} from '../controllers/marcheController.js';

const marcheRouter = express.Router();

// Routes
marcheRouter.get('/', getAllMarches);
marcheRouter.post('/add', addMarche);
marcheRouter.patch('/:id/periode', updatePeriodeDeTravail);
marcheRouter.get('/categorie/:categorie', getMarcheByCategorie);
marcheRouter.get('/:id/produits-avenir', getProduitsAVenirByMarche);
marcheRouter.get('/:id/produits', getProduitsParMarche);

export default marcheRouter;