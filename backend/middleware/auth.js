// Importation des dépendances
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

// Midldleware d'authentification
// module.exports = (req, res, next) => {
//     try {
//         // Extraction du token du header Authorization de la requête
//         const token = req.headers.authorization.split(' ')[1];
//         // Verify pour décoder le token
//         const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
//         // Récupération de l'ID utilisateur
//         const userId = decodedToken.userId;
//         // Ajout de l'ID utilisateur à la requête
//         req.auth = { userId };  
//         // Si l'Id de la requête est différente de celle du token
//         if (req.body.userId && req.body.userId !== userId) {
//             // Renvoi l'erreur
//             throw 'ID utilisateur invalide';
//         } else {
//             // Si l'ID correspond de la requête correspond à celle du token
//             next();
//         }
//     } catch {
//         res.status(401).json({
//             error: new Error('Requête invalide!')
//         });
//     }
// }

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
        
        next();
        
    } catch {
        res.status(401).json({
            error: new Error('Requête invalide!')
        });
    }
}

export {authentication}
