// Importation des dépendances
import multer from 'multer'

// Définition des formats images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

// Objet de configuration Multer, configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
    // Indique à Multer quels dossiers il doit enregistré les fichiers entrants
    destination: (req, file, callback) => {
        // Null pour indiquer qu'il n'y a pas eu d'erreur et le nom du fichier 
        callback(null, 'images')
    },
    // Indique à Mutlter quels noms de fichiers il faut utilisé 
    filename: (req, file, callback) => {
        // Génération du nom du fichier (remplace les espaces par underscore)
        const name = file.originalname.split(' ').join('_')
        // Génération de l'extension du fichier (élément qui correspond au MYMETYPE du fichier envoyé par le Frontend)
        const extension = MIME_TYPES[file.mimetype]
        
        callback(null, name + Date.now() + '.' + extension)
    }
})

const fileFilter = (req, file, callback) => {
    if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
        callback(null, true);
    } else{
        callback(null, false);
    }
}

// Single pour indiquer qu'il s'agit d'un fichier unique
const imgStorage = multer({storage: storage, }).single('image')

export {imgStorage}