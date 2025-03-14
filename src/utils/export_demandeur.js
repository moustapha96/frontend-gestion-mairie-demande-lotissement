import { saveAs } from 'file-saver';

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
  saveAs(blob, `demandeurs_${new Date().toISOString().split("T")[0]}.csv`)
}

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  saveAs(blob, `demandeurs_${new Date().toISOString().split("T")[0]}.csv`)
}
