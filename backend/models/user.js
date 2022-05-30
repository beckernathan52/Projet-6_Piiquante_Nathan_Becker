// Importation des dépendances
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator'

// Création du modèle userSchema
const userSchema =  new mongoose.Schema({
    // Unique pour éviter de s'enregistrer plusieurs fois avec la même adresse mail
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

// Application du plugin de validation unique
userSchema.plugin(uniqueValidator);

// Création et exportation du modèle userSchema
const User = mongoose.model('User', userSchema)
export {User}