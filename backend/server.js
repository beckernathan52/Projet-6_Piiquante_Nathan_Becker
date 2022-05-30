// Importation des dépendances
import http from 'http'
import dotenv from 'dotenv'
dotenv.config();

// Importation de l'application Express
import { appExpress } from './app.js';

// Renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// Récupération du port valide
const port = normalizePort(process.env.PORT || 3000);

// Indication du port sur lequel doit s'executé l'application
appExpress.set('port', port);

// Recherche les différentes erreurs et les gère de manière appropriée.
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            break;
        default:
            throw error;
    }
};

// Création du serveur
const server = http.createServer(appExpress);

// Erreur enregistré dans le serveur
server.on('error', errorHandler);
// Ecouteur d'évènements consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

// Serveur en écoute pour les requêtes envoyées
server.listen(port);