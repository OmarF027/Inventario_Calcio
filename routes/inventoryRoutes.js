const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Home page - ora usa il controller
router.get('/', inventoryController.home);

// Categorie - ora usa il controller  
router.get('/categorie', inventoryController.listaCategorie);

module.exports = router;