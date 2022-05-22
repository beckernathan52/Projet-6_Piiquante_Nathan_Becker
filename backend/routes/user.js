// Importation des modules
import * as express from 'express'

// Création du routeur avec Express
const routerUser = express.Router()

// Importation du controleur utilisateur
import {signup, login} from '../controllers/user.js'

// Création des routes POST pour l'inscription et la connexion
router.post('/signup', signup)
router.post('/login', login)

// Exportation du routeur
export {routerUser}