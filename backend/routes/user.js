// Importation des modules
const express = require('express');

// Création du routeur avec Express
const router = express.Router();

// Importation du controleur utilisateur
const userCtrl = require('../controllers/user');

// Création des routes POST pour l'inscription et la connexion
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exportation du routeur
module.exports = router;