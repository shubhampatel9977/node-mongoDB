const mongoose = require('mongoose');
const dbURL = process.env.DB_URL;
const dbName = process.env.DB_NAME;

function connection() {
  const mongoString = `${dbURL}/${dbName}`;
  mongoose.connect(mongoString);
  const database = mongoose.connection;
  database.on('error', (error) => {
    console.log(error);
  })
  
  database.once('connected', () => {
    console.log('Database Connected');
  })
}

module.exports = connection;



