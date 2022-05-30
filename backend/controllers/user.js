// Importation des dépendances
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

// Importation des informations de l'utilisateur
import { User } from '../models/user.js'

// Vérification du format de l'email
const validateEmail = (req) => {
    if ( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
        return true
    } else {
        return false
    }
}

// Vérification du mot de passe et de l'email
const checkLogIsValid = (req, res) => {
    if (validateEmail(req) === false) {
        return res.status(400).json({ error: 'Format email invalide !' })
    } else if (req.body.password === "") {
        return res.status(400).json({ error: 'Mot de passe invalide !' })
    }
    return true
}

// Inscription
const signup = async (req, res, next) => {
    try {
        // Crée un hash crypté du mot de passe de l'utilisateur, hash 10 fois
        const hash = await bcrypt.hash(req.body.password, 10)
        const userFound = await User.findOne({ email: req.body.email })

        // Si l'adresse mail est déjà utilisé
        if (userFound) {
            return res.status(403).json({ error: 'Adresse mail déjà utilisé !' })
        }
        // Définition des informations de l'utilisateur
        const user = new User({
            email: req.body.email,
            password: hash
        });

        // Si le format de l'adresse mail et le mot passe sont valide
        if ( checkLogIsValid(req, res) === true ) {
            // Sauvegarde des informations de l'utilisateur
            user.save()
            // Requête traitée avec succès et création d’un utilisateur
            return res.status(201).json({ message: 'Utilisateur créé !' })
        }  
    } catch (error) {
        res.status(500).json
        console.log(error)
    }
}

// Connexion
const login = async (req, res, next) => {   
    try {
        // Tente de trouver une adresse mail identique entre la base de données et la requête   
        const userFound = await User.findOne({ email: req.body.email })
        
        // Vérifie si l'email et le mot de passe ont un format valide
        checkLogIsValid(req, res)

        // Si aucun utilisateur n'a été trouver
        if (!userFound) {
            return res.status(401).json({ error: 'Utilisateur introuvable !' });
        }  
        
        try {
            // Compare le mot de passe de la requête avec celui de la base de donnée
            const match = await bcrypt.compare(req.body.password, userFound.password)

            // Si le mot de passe n'est pas valide
            if (!match) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            // Si le mot de passe et l'email sont valide
            res.status(200).json({ userId: userFound._id, token: jwt.sign({ userId: userFound._id }, process.env.RANDOM_TOKEN, { expiresIn: '24h' })}) 
        } catch {
            res.status(401).json 
        }   
    } catch (error) {
        res.status(500).json
        console.log(error)
    }
}

// Exportation
export {signup, login}