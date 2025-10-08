const express = require('express');
const router = express.Router();

// ROTTA TEMPORANEA - la cambieremo dopo
router.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>⚽ Inventario Calcio FUNZIONA!</h1>
        <p>Il server è attivo! 🎉</p>
        <a href="/categorie">Vai alle Categorie</a>
      </body>
    </html>
  `);
});

router.get('/categorie', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>📋 Categorie</h1>
        <p>Qui vedrai la lista delle categorie</p>
        <a href="/">Torna alla Home</a>
      </body>
    </html>
  `);
});

module.exports = router;