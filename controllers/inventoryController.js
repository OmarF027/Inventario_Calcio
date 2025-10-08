const db = require('../config/database');

exports.home = async (req, res) => {
  try {
    // Prendi alcune categorie per la home
    const [categorie] = await db.promise().query('SELECT * FROM categorie LIMIT 5');
    const [articoli] = await db.promise().query('SELECT * FROM articoli LIMIT 5');
    
    res.render('home', { 
      title: 'Inventario Calcio - Home',
      categorie: categorie,
      articoli: articoli
    });
  } catch (error) {
    console.error('Errore home:', error);
    res.render('home', { 
      title: 'Inventario Calcio - Home',
      categorie: [],
      articoli: []
    });
  }
};

exports.listaCategorie = async (req, res) => {
  try {
    const [categorie] = await db.promise().query('SELECT * FROM categorie');
    res.render('categorie/lista', { 
      title: 'Tutte le Categorie',
      categorie: categorie 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore server');
  }
};