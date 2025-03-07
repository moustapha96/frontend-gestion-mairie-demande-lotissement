"use client"
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { toast } from "sonner";
import { generateDocument, getDemandeDetails } from "@/services/demandeService";
import { cn } from "@/utils";
import { getLocaliteDtailsConfirmation, getLocaliteLotissement, getLocalites } from "@/services/localiteService";
import { getLots } from "@/services/lotsService";
import { Loader2, Save } from "lucide-react";

const AdminDemandeConfirmation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [localite, setLocalite] = useState({});
    const [lotissements, setLotissements] = useState([]);
    const [lots, setLots] = useState([]);

    const [selectedLotissement, setSelectedLotissement] = useState('');
    const [parcelles, setParcelles] = useState([]);


    const [demande, setDemande] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        // Informations du document
        document: {
            type: "PERMIS_OCCUPER",
            reference: `N° C.KL/SG/DDPF ${new Date().getFullYear()}`,
            dateDelivrance: new Date().toISOString().split('T')[0],
            lieuSignature: "Kaolack",
        },

        // Informations administratives
        administration: {
            pays: "République du Sénégal",
            region: "Kaolack",
            commune: "Kaolack",
            ampliations: ["S.G", "DDPF", "Intéressé", "Archives", "Cadastre", "Domaine"],
        },

        // Informations du bénéficiaire
        beneficiaire: {
            prenom: "",
            nom: "",
            dateNaissance: "",
            lieuNaissance: "",
            cni: {
                numero: "",
                dateDelivrance: "",
                lieuDelivrance: "",
            }
        },

        // Informations de la parcelle
        parcelle: {
            lotissement: "",
            numero: "",
            superficie: "",
            usage: "",
            referenceCadastrale: "T.F...912... (propriété de la Commune de Kaolack)",
        }
    });



    useEffect(() => {
        const fetchDetailsLocalite = async () => {
            try {
                const data = await getLocaliteDtailsConfirmation(id);
                setLocalite(data)
                setLotissements(data.lotissements);
            } catch (error) {
                toast.error("Erreur lors du chargement des lotissements");
            }
        }
        fetchDetailsLocalite();

    }, [id]);

    useEffect(() => {
        const fetchDemande = async () => {
            try {
                const data = await getDemandeDetails(id);
                setDemande(data);

                setFormData(prev => ({
                    ...prev,
                    superficie: data.superficie,
                    usagePrevu: data.usagePrevu,
                    localite: data.localite?.nom || '',
                    numeroPermis: data.typeDemande === 'BAIL_COMMUNAL'
                        ? `BC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`
                        : `PO-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
                    // Calculer automatiquement la date de fin en fonction de la durée
                    dateFin: data.typeDemande === 'BAIL_COMMUNAL'
                        ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
                        : '',
                    adresseTerrain: data.localite?.nom || ''
                }));
            } catch (error) {
                toast.error("Erreur lors du chargement de la demande");
            } finally {
                setLoading(false);
            }
        };

        fetchDemande();
    }, [id]);

    const handleLotissementChange = async (lotissementId) => {
        try {
            if (!lotissementId) {
                setParcelles([]);
                setSelectedLotissement('');
                return;
            }

            setSelectedLotissement(lotissementId);

            const lotissement = lotissements.find(lot => lot.id === Number(lotissementId));

            if (!lotissement) {
                toast.error("Lotissement non trouvé");
                setParcelles([]);
                return;
            }

            setParcelles(lotissement.parcelles || []);

            setFormData(prev => ({
                ...prev,
                lotissement: lotissement.nom,
                propositionBail: {
                    ...prev.propositionBail,
                    lotissement: lotissement.nom
                }
            }));

        } catch (error) {
            console.error("Erreur lors du changement de lotissement:", error);
            toast.error("Erreur lors du chargement des parcelles");
            setParcelles([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let dataToSubmit = { ...formData };

            switch (demande?.typeDemande) {
                case 'PROPOSITION_BAIL':
                    // Calcul automatique du montant de la caution (3 mois de loyer)
                    dataToSubmit.propositionBail.montantCaution =
                        Number(dataToSubmit.propositionBail.montantLocation) * 3;

                    // Calcul automatique de la date de fin en fonction de la durée
                    const dateEffet = new Date(dataToSubmit.propositionBail.dateEffet);
                    const dureeEnAnnees = parseInt(dataToSubmit.propositionBail.duree);
                    const dateFin = new Date(dateEffet);
                    dateFin.setFullYear(dateEffet.getFullYear() + dureeEnAnnees);
                    dataToSubmit.propositionBail.dateFin = dateFin.toISOString().split('T')[0];

                    // Ajout des références automatiques
                    dataToSubmit.propositionBail.references = `PB-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`;
                    break;

                case 'BAIL_COMMUNAL':
                    // Logique existante pour le bail communal
                    dataToSubmit.numeroBail = `BC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`;
                    break;

                case 'PERMIS_OCCUPATION':
                    // Logique existante pour le permis d'occupation
                    dataToSubmit.numeroPermis = `PO-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`;
                    break;

                default:
                    throw new Error("Type de document non supporté");
            }

            if (!validateFormData(dataToSubmit, demande?.typeDemande)) {
                toast.error("Veuillez remplir tous les champs obligatoires");
                return;
            }

            await generateDocument(id, dataToSubmit);
            toast.success("Document généré avec succès");
            navigate(`/admin/demandes/${id}/details`);
        } catch (error) {
            console.error("Erreur lors de la génération:", error);
            toast.error("Erreur lors de la génération du document");
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateFormData = (data, type) => {
        switch (type) {
            case 'PROPOSITION_BAIL':
                return (
                    data.propositionBail.typeBail &&
                    data.propositionBail.duree &&
                    data.propositionBail.montantLocation &&
                    data.propositionBail.dateEffet &&
                    data.propositionBail.conditionsPaiement
                );

            case 'BAIL_COMMUNAL':
                return (
                    data.numeroBail &&
                    data.dateDelivrance &&
                    data.superficie &&
                    data.montantLocation &&
                    data.montantCaution &&
                    data.dateDebut &&
                    data.dateFin
                );

            case 'PERMIS_OCCUPATION':
                return (
                    data.numeroPermis &&
                    data.dateDelivrance &&
                    data.dureeValidite &&
                    data.superficie &&
                    data.usagePrevu &&
                    data.numeroCNI
                );

            default:
                return false;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Chargement...</div>;
    }

    return (
        <>
            <AdminBreadcrumb title="Confirmation de la demande" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">

                            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Confirmation de la demande #{id}
                                </h2>
                                <span className={cn(
                                    "px-4 py-2 rounded-full text-sm font-semibold",
                                    demande?.typeDemande === "PERMIS_OCCUPATION"
                                        ? "bg-green-100 text-green-800"
                                        : demande?.typeDemande === "BAIL_COMMUNAL"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-yellow-100 text-yellow-800"
                                )}>
                                    {demande?.typeDemande === "PERMIS_OCCUPATION"
                                        ? "Permis d'Occupation"
                                        : demande?.typeDemande === "BAIL_COMMUNAL"
                                            ? "Bail Communal"
                                            : "Proposition de Bail"}
                                </span>
                            </div>



                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Informations du document */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Référence</label>
                                        <input
                                            type="text"
                                            value={formData.document.reference}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                document: { ...prev.document, reference: e.target.value }
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date de délivrance</label>
                                        <input
                                            type="date"
                                            value={formData.document.dateDelivrance}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                document: { ...prev.document, dateDelivrance: e.target.value }
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Lieu de signature</label>
                                        <input
                                            type="text"
                                            value={formData.document.lieuSignature}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                document: { ...prev.document, lieuSignature: e.target.value }
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Informations sur la parcelle */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Lotissement</label>
                                        <select
                                            value={selectedLotissement}
                                            onChange={(e) => handleLotissementChange(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            required
                                        >
                                            <option value="">Sélectionner un lotissement</option>
                                            {lotissements.map(lotissement => (
                                                <option key={lotissement.id} value={lotissement.id}>
                                                    {lotissement.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Parcelle</label>
                                        <select
                                            value={formData.parcelle.numero}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                parcelle: { ...prev.parcelle, numero: e.target.value }
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            required
                                            disabled={!selectedLotissement}
                                        >
                                            <option value="">Sélectionner une parcelle</option>
                                            {parcelles.map(parcelle => (
                                                <option key={parcelle.id} value={parcelle.numero}>
                                                    Parcelle {parcelle.numero}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Référence cadastrale</label>
                                        <input
                                            type="text"
                                            value={formData.parcelle.referenceCadastrale}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                parcelle: { ...prev.parcelle, referenceCadastrale: e.target.value }
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Information CNI */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Numéro CNI</label>
                                        <input
                                            type="text"
                                            value={formData.beneficiaire.cni.numero}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                beneficiaire: {
                                                    ...prev.beneficiaire,
                                                    cni: { ...prev.beneficiaire.cni, numero: e.target.value }
                                                }
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            required
                                            placeholder="Ex: 1 548 1988 06765"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date délivrance CNI</label>
                                        <input
                                            type="date"
                                            value={formData.beneficiaire.cni.dateDelivrance}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                beneficiaire: {
                                                    ...prev.beneficiaire,
                                                    cni: { ...prev.beneficiaire.cni, dateDelivrance: e.target.value }
                                                }
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Lieu délivrance CNI</label>
                                        <input
                                            type="text"
                                            value={formData.beneficiaire.cni.lieuDelivrance}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                beneficiaire: {
                                                    ...prev.beneficiaire,
                                                    cni: { ...prev.beneficiaire.cni, lieuDelivrance: e.target.value }
                                                }
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            required
                                        />
                                    </div>
                                </div>

                                {demande?.typeDemande === "PROPOSITION_BAIL" && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Type de bail</label>
                                            <select
                                                value={formData.propositionBail?.typeBail}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    propositionBail: { ...prev.propositionBail, typeBail: e.target.value }
                                                }))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                                required
                                            >
                                                <option value="">Sélectionner le type</option>
                                                <option value="COMMERCIAL">Commercial</option>
                                                <option value="HABITATION">Habitation</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Durée (années)</label>
                                            <input
                                                type="number"
                                                value={formData.propositionBail?.duree}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    propositionBail: { ...prev.propositionBail, duree: e.target.value }
                                                }))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Montant location</label>
                                            <input
                                                type="number"
                                                value={formData.propositionBail?.montantLocation}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    propositionBail: { ...prev.propositionBail, montantLocation: e.target.value }
                                                }))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {demande?.typeDemande === "BAIL_COMMUNAL" && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Montant location</label>
                                            <input
                                                type="number"
                                                value={formData.montantLocation}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    montantLocation: e.target.value
                                                }))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Date début</label>
                                            <input
                                                type="date"
                                                value={formData.dateDebut}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    dateDebut: e.target.value
                                                }))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Date fin</label>
                                            <input
                                                type="date"
                                                value={formData.dateFin}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    dateFin: e.target.value
                                                }))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {demande?.typeDemande === "PERMIS_OCCUPATION" && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Durée de validité</label>
                                            <input
                                                type="number"
                                                value={formData.dureeValidite}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    dureeValidite: e.target.value
                                                }))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                                required
                                                placeholder="En années"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Usage prévu</label>
                                            <select
                                                value={formData.parcelle.usage}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    parcelle: { ...prev.parcelle, usage: e.target.value }
                                                }))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                                required
                                            >
                                                <option value="">Sélectionner l'usage</option>
                                                <option value="HABITATION">Habitation</option>
                                                <option value="COMMERCIAL">Commercial</option>
                                                <option value="MIXTE">Mixte</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <Loader2 className="mr-1 animate-spin" /> : <Save className="mr-1" />}
                                        Générer le document
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminDemandeConfirmation;