// Importation des dépendances
import { Router } from 'express'
import { createSauce, deleteSauce, getAllSauce, getOneSauce, modifySauce } from '../controllers/sauce.js'
import { authentication } from '../middleware/auth.js'
import { imgStorage } from '../middleware/multer-config.js'

// Création du router pour les Sauces
const routerSauces = Router()

// Routes des sauces
routerSauces.post('/', authentication, imgStorage, createSauce)
routerSauces.get('/', authentication, getAllSauce)
routerSauces.get('/:id', authentication, getOneSauce)
routerSauces.put('/:id', authentication, imgStorage, modifySauce)
routerSauces.delete('/:id', authentication, deleteSauce)

export {routerSauces}