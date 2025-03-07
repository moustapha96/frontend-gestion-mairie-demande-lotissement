// Ajouter ces imports en haut du fichier


import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Ajouter ces fonctions dans le composant
export function exportToCSV (documents) {
  const headers = ['Numéro', 'Type', 'Date de création', 'Localité', 'Superficie', 'Usage prévu'];
  const data = documents.map(doc => [
    doc.type === 'PERMIS_OCCUPATION' ? doc.contenu.numeroPermis : doc.contenu.numeroBail,
    doc.type === 'PERMIS_OCCUPATION' ? 'Permis d\'occuper' : 'Bail communal',
    new Date(doc.dateCreation).toLocaleDateString('fr-FR'),
    doc.demande.localite.nom,
    `${doc.contenu.superficie} m²`,
    doc.contenu.usagePrevu
  ]);

  const csvContent = [
    headers.join(','),
    ...data.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `documents_${new Date().toISOString().split('T')[0]}.csv`);
};


export function exportToPDF(documents) {
  const doc = new jsPDF();
  doc.setLanguage('fr-FR');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.text('Liste des Documents', 15, 20);

  doc.setFontSize(10);
  doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 15, 30);

  autoTable(doc, {
    head: [['Numéro', 'Type', 'Date', 'Localité', 'Superficie', 'Usage']],
    body: documents.map(doc => [
      doc.type === 'PERMIS_OCCUPATION' ? doc.contenu.numeroPermis : doc.contenu.numeroBail,
      doc.type === 'PERMIS_OCCUPATION' ? 'Permis d\'occuper' : 'Bail communal',
      new Date(doc.dateCreation).toLocaleDateString('fr-FR'),
      doc.demande.localite.nom,
      `${doc.contenu.superficie} m²`,
      doc.contenu.usagePrevu
    ]),
    startY: 40,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      font: 'helvetica',
      textColor: [0, 0, 0],
      lineColor: [44, 62, 80],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 30 },
      5: { cellWidth: 'auto' }
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 40 }
  });

  doc.save(`documents_${new Date().toISOString().split('T')[0]}.pdf`);
}
