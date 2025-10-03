import { saveAs } from 'file-saver';

export function exportDemandesToCSV(demandes) {
    const headers = ['ID', 'Type de Demande', 'Type de Document', 'Superficie', 'Usage Prévu', 'Statut', 'Date de Création', 'Nom Demandeur', 'Localité', 'Electeur'];
    const data = demandes.map(demande => [
        demande.id,
        demande.typeDemande,
        demande.typeDocument,
        `${demande.superficie} m²`,
        demande.usagePrevu,
        demande.statut,
        new Date(demande.dateCreation).toLocaleDateString('fr-FR'),
        `${demande.demandeur.nom} ${demande.demandeur.prenom}`,
        demande.localite.nom,
        demande.demandeur.numeroElecteur
    ]);

    const csvContent = [
        headers.join(','),
        ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `demandes_${new Date().toISOString().split('T')[0]}.csv`);
}


import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportDemandesToPDF(demandes) {
    const doc = new jsPDF();
    doc.setLanguage('fr-FR');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text('Liste des Demandes', 15, 20);

    doc.setFontSize(10);
    doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 15, 30);

    autoTable(doc, {
        head: [
            ['ID', 'Type de Demande', 'Type de Document', 'Superficie', 'Usage Prévu', 'Statut', 'Date de Création', 'Nom Demandeur', 'Localité', 'Electeur']
        ],
        body: demandes.map(demande => [
            demande.id,
            demande.typeDemande === 'PERMIS_OCCUPATION' ? 'Permis d\'occuper' : demande.typeDemande === 'PROPOSITION_BAIL' ? 'Proposition de Bail' : 'Bail Communal',
            demande.typeDocument,
            `${demande.superficie} m²`,
            demande.usagePrevu,
            demande.statut,
            new Date(demande.dateCreation).toLocaleDateString('fr-FR'),
            `${demande.demandeur.nom} ${demande.demandeur.prenom}`,
            demande.localite.nom,
            demande.demandeur.numeroElecteur
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
            4: { cellWidth: 'auto' },
            5: { cellWidth: 'auto' },
            6: { cellWidth: 'auto' },
            7: { cellWidth: 'auto' },
            8: { cellWidth: 'auto' }
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        margin: { top: 40 }
    });

    doc.save(`demandes_${new Date().toISOString().split('T')[0]}.pdf`);
}