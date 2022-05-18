// Importation des dépendances
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// Importation des informations de l'utilisateur
const User = require('../models/user')


// Inscription
exports.signup = (req, res, next) => {
    // Crée un hash crypté du mot de passe de l'utilisateur, hash 10 fois
    bcrypt.hash(req.body.password, 10)

    .then(hash => {
        // Récupération des infos d'un utilisateur
        const user = new User({
            email: req.body.email,
            password: hash
        });
        // Création d'un utilisateur
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Connexion
exports.login = (req, res, next) => {
    // Tente de trouver une adresse mail identique entre la base de données et la requête
    User.findOne({ email: req.body.email })

    .then(user => {
        // Si aucun utilisateur n'a été trouver
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Compare le mot de passe de la requête avec celui de la base de donnée
        bcrypt.compare(req.body.password, user.password)

        .then(valid => {
            // Si le mot de passe n'est pas valide
            if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            // Si le mot de passe et l'email son valide
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};