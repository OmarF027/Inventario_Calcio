const express = require('express');
const path = require('path');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
const PORT = 3000;

// Configura EJS come template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware per dati dei form
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Usa le rotte
app.use('/', inventoryRoutes);

// Avvia server
app.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`);
  console.log(`⚽ Inventario Squadra Calcio - Pronto!`);
});