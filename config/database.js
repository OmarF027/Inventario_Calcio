const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'inventario_calcio'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Errore connessione database:', err.message);
    console.log('💡 Controlla che:');
    console.log('   1. WAMP sia avviato (icona verde)');
    console.log('   2. Il database "inventario_calcio" esista');
    console.log('   3. User e password siano corretti');
    return;
  }
  console.log('✅ Connesso al database inventario_calcio!');
});

module.exports = connection;