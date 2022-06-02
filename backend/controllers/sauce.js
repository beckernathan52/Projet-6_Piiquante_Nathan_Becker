// Importation des dépendances
import { Sauce } from '../models/sauce.js';

// Enregistrement d'une sauce dans la base de données
const createSauce = (req, res, next) => {

    // Vérifie si la requête contient un fichier
    if (!req.file) {
        return res.status(422).json({message: "Votre requête ne contient pas d'image"})
    }

    // Vérifie si la requête contient du texte
    if (!req.body) {
        return res.status(422).json({message: "Votre requête ne contient pas de texte"})
    }

    const sauceObject = JSON.parse(req.body.sauce)

    // Supprime le champ Id du champ de la requête(frontend) car fourni par mongoDB
    delete sauceObject._id;

    const sauce = new Sauce({
        ...sauceObject,
        // req.protocol = http/https
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        try {
            res.status(201).json({ message: 'Objet enregistré !'})
        } catch (error) {
            res.status(400).json({ error })
        }
}

// Mise à jour d'une sauce existante
const modifySauce = async (req, res, next) => {
// Ajouter suppression de l'ancienne image
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body}

    await Sauce.updateOne({ _id: req.params.id, userId: req.auth.userId}, { ...sauceObject, _id: req.params.id })
        try {
            res.status(200).json({ message: 'Objet modifié !'})
        } catch (error) {
            res.status(400).json({ error })
        }
}

// Suppression d'une sauce
const deleteSauce = async (req, res, next) => {
    await Sauce.deleteOne({ _id: req.params.id })
        try {
            res.status(200).json({ message: 'Objet supprimé !'})
        } catch (error) {
            res.status(400).json({ error })
        }
}

// Récupération d'une sauce spécifique
const getOneSauce = async (req, res, next) => {
    const sauceFound = await Sauce.findOne({ _id: req.params.id })
    
        try {
            res.status(200).json(sauceFound)
        } catch (error) {
            res.status(404).json({ error })
        }
}

// Récupération de la liste de Sauces
const getAllSauce = async (req, res, next) => {
    const allSauces = await Sauce.find()
        try {
            if (!allSauces.length) {
                return res.status(404).json({ error: "Aucune sauce n'a été trouvé"})     
            }
            res.status(200).json(allSauces)
        } catch (error) {
            res.status(400).json({ error })
        }   
}

export {createSauce, modifySauce, deleteSauce, getOneSauce, getAllSauce}