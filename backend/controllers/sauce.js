// Importation des dépendances
import { Sauce } from '../models/sauce.js';
import fs from 'fs'

// Vérifie si tous les champs sont remplis
const checkSauceValid = (req) => {
    let sauceObject = {}
    try {
        sauceObject = JSON.parse(req.body.sauce)
    } catch (error) {
        console.log(error)
        return false
    }
    
    const sauceName = sauceObject.name
    const sauceManufacturer = sauceObject.manufacturer
    const sauceDescription = sauceObject.description
    const sauceMainPepper = sauceObject.mainPepper
    const sauceHeat = sauceObject.heat
    
    if (!sauceName?.trim() || !sauceManufacturer?.trim() || !sauceDescription?.trim() || !sauceMainPepper?.trim() || !sauceHeat) {
        return false
    } 
    return true
}

// Vérifie si la sauce existe
const checkSauceExist = async (req) => {
    try {
        const sauceFound = await Sauce.findOne({ _id: req.params.id })
        return sauceFound
        
    } catch (error) {
        console.log(error)
    }
}

// Enregistrement d'une sauce dans la base de données
const createSauce = async (req, res, next) => {
    const sauceValid = checkSauceValid(req)

    // Vérifie si la requête est valide
    if (!sauceValid || !req.file) {

        // Annule l'enregistrement de l'image si la requête est invalide
        fs.unlink(`images/${req.file.filename}`, error => {
            if (error) throw error;
            console.log('Enregistrement image annulé !');
        })
        return res.status(422).json({message: "Requête incorrecte, des informations sont manquantes."})
    }

    const sauceObject = JSON.parse(req.body.sauce)

    // Supprime le champ Id du champ de la requête(frontend) car fourni par mongoDB
    delete sauceObject._id

    sauceObject.userId = req.auth.userId

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    
    try {
        await sauce.save()
        res.status(201).json({ message: 'Sauce enregistré !'})
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue !" })
        console.log(error)
    }
}

// Mise à jour d'une sauce existante
const modifySauce = async (req, res, next) => {
    
    try {
        if (!req.params.id) {
            return res.status(404).json({ error: "L'identifiant n'est pas défini."})
        }

        const sauceExist = await checkSauceExist(req)
        
        // Vérifie si la sauce existe
        if (!sauceExist) {
            return res.status(404).json({ error: "La sauce est inexistante."})
        }

        // Vérifie si l'utilisateur est autorisé
        if (sauceExist.userId !== req.auth.userId) {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à effectuer cette opération."})
        }

        // Vérifie si l'ensemble des champs sont valide
        if (!req.body.name?.trim() || !req.body.manufacturer?.trim() || !req.body.description?.trim() || !req.body.mainPepper?.trim() || !req.body.heat) {
            return res.status(422).json({message: "Requête incorrecte, des informations sont manquantes."})
        }
        
        let sauceObject

        // Si la requête contient une image
        if (req.file) {
            const filename = sauceExist.imageUrl.split('/images/')[1];

            // Supprime l'ancienne image
            fs.unlink(`images/${filename}`, error => {
                if (error) throw error;
                console.log('Ancienne image effacée !')
            })

            sauceObject = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
        
        // Si la requête ne contient pas d'image
        } else {
                sauceObject = { ...req.body }
        }
    
        await Sauce.updateOne({ _id: req.params.id, userId: req.auth.userId}, { ...sauceObject, _id: req.params.id })
        res.status(200).json({ message: 'Sauce modifié !'})

    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue !" })
        console.log(error)
    }
}


// Suppression d'une sauce
const deleteSauce = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({ error: "L'identifiant n'est pas défini."})
        }

        const sauceExist = await checkSauceExist(req)

        // Vérifie que la sauce existe 
        if (!sauceExist) {
            return res.status(404).json({ error: "La sauce est inexistante."}) 
        }
        // Vérifie si l'utilisateur est autorisé
        if (sauceExist.userId !== req.auth.userId) {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à effectuer cette opération."})
        }
        
        const filename = sauceExist.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, error => {
            if (error) throw error;
            console.log('Image effacée !')
        })
        
        await Sauce.deleteOne({ _id: req.params.id })
        res.status(200).json({ message: 'Sauce supprimé !'})
    
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue !" })
        console.log(error)
    }
}


// Récupération d'une sauce spécifique
const getOneSauce = async (req, res, next) => {
    try {
        const sauceExist = await checkSauceExist(req)

        // Vérifie si la sauce existe
        if (!sauceExist) {
            res.status(404).json({ error: "Aucune sauce n'a été trouvé."})  
        }
        res.status(200).json(sauceExist)
        
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue !" })
        console.log(error)
    }
}


// Récupération de la liste de Sauces
const getAllSauce = async (req, res, next) => {
    try {
        const allSauces = await Sauce.find()

        if (!allSauces.length) {
            return res.status(404).json({ error: "Aucune sauce n'a été trouvé."})     
        }
        res.status(200).json(allSauces)
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue !" })
        console.log(error)
    }
}


// Like et Dislike
const likeOrDislike = async (req, res, next) => {
    
    const userId = req.auth.userId
    const like = req.body.like

    try{
        // Vérifie si la sauce existe
        const sauceExist = await checkSauceExist(req)

        if (!sauceExist) {
            res.status(404).json({ error: "Aucune sauce n'a été trouvé."})  
        }
        
        // Like
        if (like === 1) {
            
            // Si l'utilisateur like déjà la sauce
            if (sauceExist.usersLiked.includes(userId)) {
                return res.status(403).json({message: "Vous likez déjà la sauce !"})
            }

            // Si l'utilisateur tente de dislike la sauce alors qu'il avait like
            if (sauceExist.usersDisliked.includes(userId)) {
                return res.status(403).json({message: "Impossible de liké et disliké une même sauce."})
            }

            await Sauce.updateOne({_id: req.params.id}, {$inc: { likes: 1 }, $push: { usersLiked: userId }})
            res.status(200).json({message: 'Sauce likée !'})
        }
            
        // Dislike
        if (like === -1) {
            
            // Si l'utilisateur a like la sauce alors qu'il dislikait
            if (sauceExist.usersLiked.includes(userId)) {
                return res.status(403).json({message: "Impossible de liké et disliké une même sauce."})
            }

            // Si l'utilisateur dislike déjà la sauce
            if (sauceExist.usersDisliked.includes(userId)) {
                return res.status(403).json({message: "Sauce déjà dislikée !"})
            }

            await Sauce.updateOne({_id: req.params.id}, {$inc: { dislikes: 1 }, $push: { usersDisliked: userId }})
            res.status(200).json({message: 'Sauce dislikée !'})
        }

        // Annulation
        if (like === 0) {
            // Annulation de like
            if (sauceExist.usersLiked.includes(userId)) {
                await Sauce.updateOne({_id: req.params.id}, {$inc: { likes: -1 }, $pull: { usersLiked: userId }})
                res.status(200).json({message: 'Like annulé !'})
            }

            // Annulation de dislike
            if (sauceExist.usersDisliked.includes(userId)) {
                await Sauce.updateOne({_id: req.params.id}, {$inc: { dislikes: -1 }, $pull: { usersDisliked: userId }})
                res.status(200).json({message: 'Dislike annulé !'})
            }
        }
    } catch (error) {
        res.status(404).json({message: error.message})
        console.log(error)
    }
}

export {createSauce, modifySauce, deleteSauce, getOneSauce, getAllSauce, likeOrDislike}