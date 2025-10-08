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

// FUNZIONI PER CREARE CATEGORIE
exports.nuovaCategoria = (req, res) => {
  res.render('categorie/nuova', { 
    title: 'Nuova Categoria'
  });
};

exports.creaCategoria = async (req, res) => {
  try {
    const { nome, descrizione } = req.body;
    
    // Validazione semplice
    if (!nome || nome.trim() === '') {
      return res.render('categorie/nuova', { 
        title: 'Nuova Categoria',
        error: 'Il nome della categoria è obbligatorio!'
      });
    }
    
    await db.promise().query(
      'INSERT INTO categorie (nome, descrizione) VALUES (?, ?)',
      [nome.trim(), descrizione.trim()]
    );
    
    res.redirect('/categorie');
  } catch (error) {
    console.error('Errore creazione categoria:', error);
    res.render('categorie/nuova', { 
      title: 'Nuova Categoria',
      error: 'Errore nel salvataggio: ' + error.message
    });
  }
};

// FUNZIONI PER GLI ARTICOLI
exports.nuovoArticolo = async (req, res) => {
  try {
    const [categorie] = await db.promise().query('SELECT * FROM categorie');
    res.render('articoli/nuovo', { 
      title: 'Nuovo Articolo',
      categorie: categorie
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore server');
  }
};

exports.creaArticolo = async (req, res) => {
  try {
    const { nome, descrizione, quantita, categoria_id } = req.body;
    
    // Validazione
    if (!nome || nome.trim() === '') {
      const [categorie] = await db.promise().query('SELECT * FROM categorie');
      return res.render('articoli/nuovo', { 
        title: 'Nuovo Articolo',
        categorie: categorie,
        error: 'Il nome dell\'articolo è obbligatorio!'
      });
    }
    
    await db.promise().query(
      'INSERT INTO articoli (nome, descrizione, quantita, categoria_id) VALUES (?, ?, ?, ?)',
      [nome.trim(), descrizione.trim(), parseInt(quantita) || 0, categoria_id]
    );
    
    res.redirect('/');
  } catch (error) {
    console.error('Errore creazione articolo:', error);
    const [categorie] = await db.promise().query('SELECT * FROM categorie');
    res.render('articoli/nuovo', { 
      title: 'Nuovo Articolo',
      categorie: categorie,
      error: 'Errore nel salvataggio: ' + error.message
    });
  }
};

// ELIMINAZIONE CATEGORIA (CON PASSWORD NASCOSTA)
exports.eliminaCategoria = async (req, res) => {
  try {
    const { adminPassword } = req.body;
    const categoriaId = req.params.id;
    
    // Controllo password NASCOSTA
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      const [categorie] = await db.promise().query('SELECT * FROM categorie');
      return res.render('categorie/lista', {
        title: 'Tutte le Categorie',
        categorie: categorie,
        error: 'Password admin errata!'
      });
    }
    
    // Controlla se ci sono articoli in questa categoria
    const [articoli] = await db.promise().query(
      'SELECT * FROM articoli WHERE categoria_id = ?', 
      [categoriaId]
    );
    
    if (articoli.length > 0) {
      return res.render('categorie/errore', {
        title: 'Errore Eliminazione',
        error: 'Non puoi eliminare una categoria che contiene articoli!',
        categoriaId: categoriaId
      });
    }
    
    await db.promise().query('DELETE FROM categorie WHERE id = ?', [categoriaId]);
    res.redirect('/categorie');
    
  } catch (error) {
    console.error('Errore eliminazione categoria:', error);
    res.status(500).send('Errore server durante l\'eliminazione');
  }
};

// LISTA COMPLETA ARTICOLI
exports.listaArticoli = async (req, res) => {
  try {
    const [articoli] = await db.promise().query(`
      SELECT a.*, c.nome as categoria_nome 
      FROM articoli a 
      LEFT JOIN categorie c ON a.categoria_id = c.id 
      ORDER BY a.nome
    `);
    
    res.render('articoli/lista', { 
      title: 'Tutti gli Articoli',
      articoli: articoli 
    });
  } catch (error) {
    console.error('Errore lista articoli:', error);
    res.status(500).send('Errore server');
  }
};

// === ARTICOLI - UPDATE ===
exports.modificaArticolo = async (req, res) => {
  try {
    const articoloId = req.params.id;
    const [articolo] = await db.promise().query('SELECT * FROM articoli WHERE id = ?', [articoloId]);
    const [categorie] = await db.promise().query('SELECT * FROM categorie');
    
    if (articolo.length === 0) {
      return res.status(404).send('Articolo non trovato');
    }
    
    res.render('articoli/modifica', {
      title: 'Modifica Articolo',
      articolo: articolo[0],
      categorie: categorie
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore server');
  }
};

exports.aggiornaArticolo = async (req, res) => {
  try {
    const articoloId = req.params.id;
    const { nome, descrizione, quantita, categoria_id } = req.body;
    
    await db.promise().query(
      'UPDATE articoli SET nome = ?, descrizione = ?, quantita = ?, categoria_id = ? WHERE id = ?',
      [nome, descrizione, quantita, categoria_id, articoloId]
    );
    
    res.redirect('/articoli');
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore server');
  }
};

// === ARTICOLI - DELETE (CON PASSWORD NASCOSTA) ===
exports.eliminaArticolo = async (req, res) => {
  try {
    const { adminPassword } = req.body;
    const articoloId = req.params.id;
    
    // Controllo password NASCOSTA
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      const [articoli] = await db.promise().query(`
        SELECT a.*, c.nome as categoria_nome 
        FROM articoli a 
        LEFT JOIN categorie c ON a.categoria_id = c.id 
        ORDER BY a.nome
      `);
      return res.render('articoli/lista', {
        title: 'Tutti gli Articoli',
        articoli: articoli,
        error: 'Password admin errata!'
      });
    }
    
    await db.promise().query('DELETE FROM articoli WHERE id = ?', [articoloId]);
    res.redirect('/articoli');
  } catch (error) {
    console.error('Errore eliminazione articolo:', error);
    res.status(500).send('Errore server');
  }
};

// === ARTICOLI - DETAIL ===
exports.dettaglioArticolo = async (req, res) => {
  try {
    const articoloId = req.params.id;
    const [articolo] = await db.promise().query(`
      SELECT a.*, c.nome as categoria_nome 
      FROM articoli a 
      LEFT JOIN categorie c ON a.categoria_id = c.id 
      WHERE a.id = ?
    `, [articoloId]);
    
    if (articolo.length === 0) {
      return res.status(404).send('Articolo non trovato');
    }
    
    res.render('articoli/dettaglio', {
      title: 'Dettaglio Articolo',
      articolo: articolo[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore server');
  }
};

// === CATEGORIE - UPDATE ===
exports.modificaCategoria = async (req, res) => {
  try {
    const categoriaId = req.params.id;
    const [categoria] = await db.promise().query('SELECT * FROM categorie WHERE id = ?', [categoriaId]);
    
    if (categoria.length === 0) {
      return res.status(404).send('Categoria non trovata');
    }
    
    res.render('categorie/modifica', {
      title: 'Modifica Categoria',
      categoria: categoria[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore server');
  }
};

exports.aggiornaCategoria = async (req, res) => {
  try {
    const categoriaId = req.params.id;
    const { nome, descrizione } = req.body;
    
    await db.promise().query(
      'UPDATE categorie SET nome = ?, descrizione = ? WHERE id = ?',
      [nome, descrizione, categoriaId]
    );
    
    res.redirect('/categorie');
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore server');
  }
};

// === CATEGORIE - DETAIL ===
exports.dettaglioCategoria = async (req, res) => {
  try {
    const categoriaId = req.params.id;
    const [categoria] = await db.promise().query('SELECT * FROM categorie WHERE id = ?', [categoriaId]);
    const [articoli] = await db.promise().query('SELECT * FROM articoli WHERE categoria_id = ?', [categoriaId]);
    
    if (categoria.length === 0) {
      return res.status(404).send('Categoria non trovata');
    }
    
    res.render('categorie/dettaglio', {
      title: 'Dettaglio Categoria',
      categoria: categoria[0],
      articoli: articoli
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore server');
  }
};