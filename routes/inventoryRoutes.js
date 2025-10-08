const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Home page
router.get('/', inventoryController.home);

// Articoli - CRUD COMPLETO
router.get('/articoli', inventoryController.listaArticoli);
router.get('/articoli/nuovo', inventoryController.nuovoArticolo);
router.post('/articoli/crea', inventoryController.creaArticolo);
router.get('/articoli/:id/modifica', inventoryController.modificaArticolo);
router.post('/articoli/:id/aggiorna', inventoryController.aggiornaArticolo);
router.post('/articoli/:id/elimina', inventoryController.eliminaArticolo);
router.get('/articoli/:id', inventoryController.dettaglioArticolo);

// Categorie - CRUD COMPLETO
router.get('/categorie', inventoryController.listaCategorie);
router.get('/categorie/nuova', inventoryController.nuovaCategoria);
router.post('/categorie/crea', inventoryController.creaCategoria);
router.post('/categorie/:id/elimina', inventoryController.eliminaCategoria);
router.get('/categorie/:id/modifica', inventoryController.modificaCategoria);
router.post('/categorie/:id/aggiorna', inventoryController.aggiornaCategoria);
router.get('/categorie/:id', inventoryController.dettaglioCategoria);

module.exports = router;