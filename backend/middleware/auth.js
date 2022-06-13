// Importation des dépendances
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

// Middleware d'authentification
const authentication =  (req, res, next) => {
    try {
        // Extraction du token du header Authorization de la requête
        const token =  req.headers.authorization.split(' ')[1];
        // Verify pour décoder le token
        const decodedToken =  jwt.verify(token, process.env.RANDOM_TOKEN);
        // Récupération de l'ID utilisateur
        const userId = decodedToken.userId;
        // Ajout de l'ID utilisateur à la requête
        req.auth = { userId };  
        // req.auth.userId pour vérifier la modification des sauces
        next();
        
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Erreur authentification' })
        // res.status(401).json({
        // error: new Error('Requête invalide!')
            
        // });
    }
}

export {authentication}



// Voir avec Florian pour les problèmes d'authentification