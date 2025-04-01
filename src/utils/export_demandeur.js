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

  const filteredDemandeurs = demandeurs.filter((demandeur) => !demandeur.roles.includes("ROLE_ADMIN") && !demandeur.isHabitant   );
  const data = filteredDemandeurs.map((demandeur) =>
    [
      demandeur.id,
      demandeur.nom,
      demandeur.prenom,
      demandeur.email,
      demandeur.telephone,
      demandeur.isHabitant ? "Oui" : "Non",
      demandeur.numeroElecteur || "",
      demandeur.demandes?.length || 0,
    ].map(escapeCSV),
  )

  const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n")

  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = "\uFEFF"
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
  saveAs(blob, `demandeurs_non_habitant_${new Date().toISOString().split("T")[0]}.csv`)
}



/**
 * Exports demandeur data to a PDF file
 * @param {Array} demandeurs - Array of demandeur objects
 */
export function exportDemandeurToPDF(demandeurs) {
  const doc = new jsPDF()
  doc.setLanguage("fr-FR")

  doc.setFont("helvetica", "normal")
  doc.setFontSize(16)
  doc.text("Liste des Demandeurs", 15, 20)

  doc.setFontSize(10)
  doc.text(`Exporté le ${new Date().toLocaleDateString("fr-FR")}`, 15, 30)

const filteredDemandeurs = demandeurs.filter((demandeur) => !demandeur.roles.includes("ROLE_ADMIN"));

  autoTable(doc, {
      head: [["ID", "Nom", "Prénom", "Email", "Téléphone", "Habitant", "Numéro Électeur", "Demandes"]],
    
    body: filteredDemandeurs.map((demandeur) => [
      demandeur.id,
      demandeur.nom,
      demandeur.prenom,
      demandeur.email,
      demandeur.telephone,
      demandeur.isHabitant ? "Oui" : "Non",
      demandeur.numeroElecteur || "-",
      demandeur.demandes?.length || 0,
    ]),
    startY: 40,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      font: "helvetica",
      textColor: [0, 0, 0],
      lineColor: [44, 62, 80],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 40 },
  })

  doc.save(`demandeurs_${new Date().toISOString().split("T")[0]}.pdf`)
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
  const data = filteredDemandeurs.map((demandeur) =>
    [
      demandeur.id,
      demandeur.nom,
      demandeur.prenom,
      demandeur.email,
      demandeur.telephone,
      demandeur.isHabitant ? "Oui" : "Non",
      demandeur.numeroElecteur || "",
      demandeur.demandes?.length || 0,
    ].map(escapeCSV),
  )

  const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n")

  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = "\uFEFF"
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
  saveAs(blob, `demandeurs_habitant_${new Date().toISOString().split("T")[0]}.csv`)
}



export function templateDemande(){

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
    "Type de demande",
    "Localite",
    "Superficie",
    "Usage prevu",
    "Date Demande",
  ];

   // Données vides pour l'exemple
   const data = [headers, ["", "", "", "", "", "", "", "", "", "", "", "", ""]];
    // Création de la feuille Excel
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Pré-remplir les cellules de la colonne "Type de demande"
  for (let i = 2; i <= 100; i++) {
    ws[`J${i}`] = { v: "", t: "s" };
  }

   // Définition des options autorisées pour la colonne "Type de demande"
   const validationRange = "J2:J100"; // Colonne J, de la ligne 2 à 100

   ws["!dataValidation"] = [
    {
      type: "list",
      formula1: '"PERMIS_OCCUPATION,PROPOSITION_BAIL,BAIL_COMMUNAL"',
      allowBlank: false,
      showDropDown: true,
      sqref: validationRange,
    },
  ];
   // Création du classeur Excel
   const wb = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, "Demandes importées");

   // Génération du fichier Excel
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  // Téléchargement du fichier
  saveAs(blob, "template_import_demandes.xlsx");
}
