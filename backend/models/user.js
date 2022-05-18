// Importation des dépendances
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schéma utilisateur
const userSchema = mongoose.Schema({
    // Unique pour éviter de s'enregistrer plusieurs fois avec la même adresse mail
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Application du plugin de validation unique
userSchema.plugin(uniqueValidator);

// Création et exportation du modèle userSchema
module.exports = mongoose.model('User', userSchema);