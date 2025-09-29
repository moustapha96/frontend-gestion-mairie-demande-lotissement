import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";


/**
 * Exports demandeur data to a CSV file
 * @param {Array} demandeurs - Array of demandeur objects with their related data
 */
export function exportDemandeurNonHabitantToCSV(demandeurs) {
    const escapeCSV = (value) => {
        if (value === null || value === undefined) return ""
        const stringValue = String(value)
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
            return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
    }

    const headers = ["ID", "Nom", "Prénom", "Email", "Téléphone", "Habitant", "Numéro Électeur", "Nombre de Demandes"]

    const filteredDemandeurs = demandeurs.filter((demandeur) => !demandeur.roles.includes("ROLE_ADMIN") && !demandeur.isHabitant);
    const data = filteredDemandeurs.map((demandeur) => [
        demandeur.id,
        demandeur.nom,
        demandeur.prenom,
        demandeur.email,
        demandeur.telephone,
        demandeur.isHabitant ? "Oui" : "Non",
        demandeur.numeroElecteur || "",
        demandeur.demandes.length || 0,
    ].map(escapeCSV), )

    const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n")

    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = "\uFEFF"
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, `demandeurs_non_habitant_${new Date().toISOString().split("T")[0]}.csv`)
}



/**
 * Exporte les données des demandeurs vers un fichier PDF
 * @param {Array} demandeurs - Tableau d'objets représentant les demandeurs
 */
export function exportDemandeurToPDF(demandeurs) {
    // Initialisation du document PDF
    const doc = new jsPDF({
        orientation: "landscape", // Format paysage pour plus de colonnes
        unit: "mm",
    });

    // Configuration de base du document
    doc.setLanguage("fr-FR");
    doc.setFont("helvetica", "normal");

    // Titre du document
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80); // Couleur bleu foncé
    doc.text("Liste des Demandeurs", 15, 15);

    // Date d'export
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Couleur grise
    doc.text(`Exporté le : ${new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })}`, 15, 22);

    // Filtrer les demandeurs (exclure les administrateurs)
    const filteredDemandeurs = demandeurs.filter(
        (demandeur) => !demandeur.roles.includes("ROLE_ADMIN")
    );

    // Définition des colonnes du tableau
    const columns = [
        { header: "ID", dataKey: "id" },
        { header: "Nom", dataKey: "nom" },
        { header: "Prénom", dataKey: "prenom" },
        { header: "Email", dataKey: "email" },
        { header: "Téléphone", dataKey: "telephone" },
        { header: "Habitant", dataKey: "isHabitant" },
        { header: "Numéro Électeur", dataKey: "numeroElecteur" },
        { header: "Date de Naissance", dataKey: "dateNaissance" },
        { header: "Lieu de Naissance", dataKey: "lieuNaissance" },
        { header: "Adresse", dataKey: "adresse" },
        { header: "Profession", dataKey: "profession" },
        { header: "Situation Matrimoniale", dataKey: "situationMatrimoniale" },
        { header: "Nombre d'Enfants", dataKey: "nombreEnfant" },
        { header: "Nombre de Demandes", dataKey: "demandes" },
    ];

    // Préparation des données pour le tableau
    const tableData = filteredDemandeurs.map((demandeur) => ({
        id: demandeur.id || "-",
        nom: demandeur.nom || "-",
        prenom: demandeur.prenom || "-",
        email: demandeur.email || "-",
        telephone: demandeur.telephone || "-",
        isHabitant: demandeur.isHabitant ? "Oui" : "Non",
        numeroElecteur: demandeur.numeroElecteur || "-",
        dateNaissance: demandeur.dateNaissance ?
            new Date(demandeur.dateNaissance).toLocaleDateString("fr-FR") :
            "-",
        lieuNaissance: demandeur.lieuNaissance || "-",
        adresse: demandeur.adresse || "-",
        profession: demandeur.profession || "-",
        situationMatrimoniale: demandeur.situationMatrimoniale || "-",
        nombreEnfant: demandeur.nombreEnfant || "0",
        demandes: demandeur.demandes ? demandeur.demandes.length : "0",
    }));

    // Configuration du tableau avec autoTable
    doc.autoTable({
        head: [columns.map((col) => col.header)],
        body: tableData.map((row) =>
            columns.map((col) => row[col.dataKey])
        ),
        startY: 30,
        theme: "grid",
        styles: {
            fontSize: 8,
            cellPadding: 2,
            font: "helvetica",
            textColor: [0, 0, 0],
            lineColor: [44, 62, 80],
            lineWidth: 0.1,
            overflow: "linebreak", // Permet le retour à la ligne dans les cellules
        },
        headStyles: {
            fillColor: [41, 128, 185], // Bleu
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: "bold",
            halign: "center",
            valign: "middle",
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245], // Gris clair
        },
        columnStyles: {
            5: { cellWidth: 15 }, // Habitant
            6: { cellWidth: 20 }, // Numéro Électeur
            7: { cellWidth: 20 }, // Date de Naissance
            8: { cellWidth: 20 }, // Lieu de Naissance
            9: { cellWidth: 30 }, // Adresse
            10: { cellWidth: 20 }, // Profession
            11: { cellWidth: 25 }, // Situation Matrimoniale
            12: { cellWidth: 15 }, // Nombre d'Enfants
        },
        margin: { top: 30, right: 10, bottom: 10, left: 10 },
        didDrawPage: (data) => {
            // Pied de page avec numéro de page
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(
                `Page ${doc.internal.getNumberOfPages()}`,
                data.settings.margin.left,
                doc.internal.pageSize.height - 10
            );
        },
    });

    // Sauvegarde du PDF
    doc.save(`demandeurs_${new Date().toISOString().split("T")[0]}.pdf`);
}





export function exportDemandeurHabitantToCSV(demandeurs) {
    const escapeCSV = (value) => {
        if (value === null || value === undefined) return ""
        const stringValue = String(value)
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
            return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
    }

    const headers = ["ID", "Nom", "Prénom", "Email", "Téléphone", "Habitant", "Numéro Électeur", "Nombre de Demandes"]

    const filteredDemandeurs = demandeurs.filter((demandeur) => {
        return !demandeur.roles.includes("ROLE_ADMIN") && demandeur.isHabitant
    });
    const data = filteredDemandeurs.map((demandeur) => [
        demandeur.id,
        demandeur.nom,
        demandeur.prenom,
        demandeur.email,
        demandeur.telephone,
        demandeur.isHabitant ? "Oui" : "Non",
        demandeur.numeroElecteur || "",
        demandeur.demandes.length || 0,
    ].map(escapeCSV), )

    const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n")

    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = "\uFEFF"
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, `demandeurs_habitant_${new Date().toISOString().split("T")[0]}.csv`)
}


export function templateDemande() {
    // En-têtes du fichier Excel (tous les champs nécessaires)
    const headers = [
        "CNI",
        "Email",
        "Nom",
        "Prenom",
        "Telephone",
        "Adresse",
        "Lieu de Naissance",
        "Date de Naissance",
        "Profession",
        "Situation Matrimoniale",
        "Nombre Enfant",
        "Type de demande",
        "Localite",
        "Superficie",
        "Usage prevu",
        "Possède autre terrain",
        "Type de titre",
        "Terrain à Kaolack",
        "Terrain ailleurs",
        "Date Demande",
    ];

    // Données d'exemple pour la première ligne
    const exampleRow = [
        "1234567890", // CNI
        "user@example.com", // Email
        "Khouma", // Nom
        "Al Hussein", // Prenom
        "771234567", // Telephone
        "123 Rue de la Mairie, Dakar", // Adresse
        "Dakar", // Lieu de Naissance
        "1990-01-15", // Date de Naissance (format: AAAA-MM-JJ)
        "Ingénieur", // Profession
        "Célibataire", // Situation Matrimoniale
        "2", // Nombre Enfant
        "Attribution", // Type de demande
        "Kaolack", // Localite
        "500", // Superficie
        "Construction", // Usage prevu
        "Non", // Possède autre terrain
        "Permis d'occuper", // Type de titre
        "Oui", // Terrain à Kaolack
        "Non", // Terrain ailleurs
        "2025-01-01", // Date Demande (format: AAAA-MM-JJ)
    ];

    // Création des données pour le template (en-têtes + exemple)
    const data = [headers, exampleRow];

    // Création de la feuille Excel
    const ws = XLSX.utils.aoa_to_sheet(data);

    // =============================================
    // Définition des validations pour les colonnes
    // =============================================

    // 1. Validation pour "Type de demande" (colonne L)
    const typeDemandeRange = "L2:L1000";
    if (!ws["!dataValidation"]) ws["!dataValidation"] = [];
    ws["!dataValidation"].push({
        type: "list",
        formula1: '"Attribution,Régularisation,Authentification"',
        allowBlank: false,
        showDropDown: true,
        sqref: typeDemandeRange,
    });

    // 2. Validation pour "Situation Matrimoniale" (colonne J)
    const situationMatrimonialeRange = "J2:J1000";
    ws["!dataValidation"].push({
        type: "list",
        formula1: '"Célibataire,Marié(e),Divorcé(e),Veuf(ve)"',
        allowBlank: false,
        showDropDown: true,
        sqref: situationMatrimonialeRange,
    });

    // 3. Validation pour "Type de titre" (colonne Q)
    const typeTitreRange = "Q2:Q1000";
    ws["!dataValidation"].push({
        type: "list",
        formula1: '"Permis d\'occuper,Bail communal,Proposition de bail,Transfert définitif"',
        allowBlank: false,
        showDropDown: true,
        sqref: typeTitreRange,
    });

    // 4. Validation pour "Possède autre terrain" (colonne P)
    const possedeTerrainRange = "P2:P1000";
    ws["!dataValidation"].push({
        type: "list",
        formula1: '"Oui,Non"',
        allowBlank: false,
        showDropDown: true,
        sqref: possedeTerrainRange,
    });

    // 5. Validation pour "Terrain à Kaolack" (colonne R)
    const terrainKaolackRange = "R2:R1000";
    ws["!dataValidation"].push({
        type: "list",
        formula1: '"Oui,Non"',
        allowBlank: false,
        showDropDown: true,
        sqref: terrainKaolackRange,
    });

    // 6. Validation pour "Terrain ailleurs" (colonne S)
    const terrainAilleursRange = "S2:S1000";
    ws["!dataValidation"].push({
        type: "list",
        formula1: '"Oui,Non"',
        allowBlank: false,
        showDropDown: true,
        sqref: terrainAilleursRange,
    });

    // =============================================
    // Mise en forme des colonnes (largeur, format)
    // =============================================
    ws["!cols"] = [
        { wch: 15 }, // CNI
        { wch: 25 }, // Email
        { wch: 15 }, // Nom
        { wch: 15 }, // Prenom
        { wch: 15 }, // Telephone
        { wch: 30 }, // Adresse
        { wch: 20 }, // Lieu de Naissance
        { wch: 15 }, // Date de Naissance
        { wch: 20 }, // Profession
        { wch: 20 }, // Situation Matrimoniale
        { wch: 10 }, // Nombre Enfant
        { wch: 20 }, // Type de demande
        { wch: 15 }, // Localite
        { wch: 10 }, // Superficie
        { wch: 20 }, // Usage prevu
        { wch: 20 }, // Possède autre terrain
        { wch: 20 }, // Type de titre
        { wch: 20 }, // Terrain à Kaolack
        { wch: 20 }, // Terrain ailleurs
        { wch: 15 }, // Date Demande
    ];

    // =============================================
    // Création du classeur Excel et téléchargement
    // =============================================
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Import Demandes");

    // Génération du fichier Excel
    const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
    });

    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Téléchargement du fichier
    saveAs(blob, "template_import_demandes.xlsx");
}