// Importation des modules
const express = require('express');
const mongoose = require('mongoose');

// Création de l'application Express
const appExpress = express();

// Importation des routes
const userRoutes = require('./routes/user');



// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://Nathanb:8No67MP6FDTMpbZu@cluster0.oe8xh.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Analyse du corps de la requête
appExpress.use(express.json());

// Résoud les erreurs de CORS
appExpress.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// Routes
appExpress.use('/api/auth', userRoutes);

// Exportation de l'application
module.exports = appExpress;