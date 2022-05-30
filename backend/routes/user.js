// Importation du router
import { Router } from 'express'

// Création du routeur avec Express
const routerUser = Router()

// Importation du controleur utilisateur
import {signup, login} from '../controllers/user.js'

// Création des routes POST pour l'inscription et la connexion
routerUser.post('/signup', signup)
routerUser.post('/login', login)

// Exportation du routeur
export {routerUser}