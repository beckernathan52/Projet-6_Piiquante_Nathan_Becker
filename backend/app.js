// Importation des dépendances
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
import path  from 'path';
import { fileURLToPath } from 'url'

// Importation des routes
import { routerUser } from './routes/user.js'
import { routerSauces } from './routes/sauce.js';

// Création de l'application Express
const appExpress = express()

// Connexion à la base de données MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_CONNECTION,
            // @ts-ignore
            { useNewUrlParser: true,
                useUnifiedTopology: true })
        console.log('Connexion à MongoDB réussie !')
    } catch {
        console.log('Connexion à MongoDB échouée !')
    }
}   
connectDB()

// Analyse du corps de la requête
appExpress.use(express.json());

// Résoud les erreurs de CORS
appExpress.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

// @ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

// Routes
appExpress.use('/api/auth', routerUser)
appExpress.use('/api/sauces', routerSauces)
appExpress.use('/images', express.static(path.join(__dirname, 'images')))

// Exportation de l'application Express
export {appExpress}