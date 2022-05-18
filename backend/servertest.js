// Importation des modules
const http = require('http');
const appExpress = require('./app');
const dotenv = require("dotenv");
dotenv.config();

// Récupération du port
const MY_PORT = process.env.PORT;

appExpress.set('port', MY_PORT)
// Création du serveur
const server = http.createServer(appExpress);
// Ecoute du port
server.listen(MY_PORT, () => console.log(`Server running on port ${MY_PORT}`)); 



















