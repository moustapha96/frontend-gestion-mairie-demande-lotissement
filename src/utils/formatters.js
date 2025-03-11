/**
 * Formate un nombre en prix avec le format monétaire CFA
 * @param {number} amount - Le montant à formater
 * @returns {string} Le montant formaté (ex: 1 000 000 FCFA)
 */
export const formatPrice = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' FCFA';
};

/**
 * Formate un nombre avec des séparateurs de milliers
 * @param {number} number - Le nombre à formater 
 * @returns {string} Le nombre formaté avec séparateurs
 */
export const formatNumber = (number) => {
    if (!number && number !== 0) return 'N/A';
    
    return new Intl.NumberFormat('fr-FR').format(number);
};

/**
 * Formate une coordonnée GPS en degrés décimaux avec une précision définie
 * @param {number} coordinate - La coordonnée à formater
 * @param {number} precision - Le nombre de décimales (défaut: 6)
 * @returns {string} La coordonnée formatée
 */
export const formatCoordinate = (coordinate, precision = 6) => {
    if (!coordinate && coordinate !== 0) return 'N/A';
    return Number(coordinate).toFixed(precision);
};

/**
 * Formate un couple de coordonnées GPS (latitude, longitude)
 * @param {number} latitude - La latitude
 * @param {number} longitude - La longitude
 * @returns {string} Les coordonnées formatées (ex: 14.693700, -17.444100)
 */
export const formatCoordinates = (latitude, longitude) => {
    if (!latitude || !longitude) return 'N/A';
    return `${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}`;
};

/**
 * Formate un numéro de téléphone au format sénégalais (77 900 00 00)
 * @param {string} phoneNumber - Le numéro à formater
 * @returns {string} Le numéro formaté 
 */
export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'N/A';
    
    // Supprimer tous les caractères non numériques
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Vérifier si le numéro a la bonne longueur
    if (cleaned.length !== 9) return phoneNumber;
    
    // Formater le numéro (77 900 00 00)
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
    
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    
    return phoneNumber;
};