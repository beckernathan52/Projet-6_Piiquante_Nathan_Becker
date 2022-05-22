// Importation des dépendances
import * as mongoose from 'mongoose'
import * as uniqueValidator from 'mongoose-unique-validator'

// Création du modèle userSchema
const userSchema = mongoose.Schema({
    // Unique pour éviter de s'enregistrer plusieurs fois avec la même adresse mail
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});


// const Schema = mongoose.Schema
// const userSchema = new Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// })


// Application du plugin de validation unique
userSchema.plugin(uniqueValidator);

// Création et exportation du modèle userSchema
// module.exports = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema)
export {User}