import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getDemande } from "../../../services/demandeService";
import { getFileDocument } from "../../../services/documentService";
import { Card, Typography, Descriptions, Space, Skeleton, Result } from "antd";
import {
    CalendarOutlined,
    TrophyOutlined,
    CheckCircleOutlined,
    BankOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    UserOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const DemandeDetails = () => {
    const { id } = useParams();
    const [demande, setDemande] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fichier, setFichier] = useState(null);

    useEffect(() => {
        const fetchDemande = async () => {
            try {
                const data = await getDemande(id);
                setDemande(data);
                if (data.document) {
                    const response = await getFileDocument(data.document.id);
                    setFichier(response);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDemande();
    }, [id]);

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorDisplay error={error} />;
    if (!demande) return <ErrorDisplay error="Aucune donnée trouvée" />;

    return (
        <>
            <AdminBreadcrumb title="Détails Demande" SubTitle={demande.intitule} />
            <div className="container my-6">
                <Card className="shadow-lg">
                    <Title level={3}>{demande.intitule}</Title>
                    
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mt-6">
                        <Card title="Informations sur la Demande" className="bg-gray-50">
                            <Descriptions column={1}>
                                <Descriptions.Item label={<Space><CalendarOutlined /> Date de Demande</Space>}>
                                    {new Date(demande.dateDemande).toLocaleDateString()}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><TrophyOutlined /> Année d'Obtention</Space>}>
                                    {demande.anneeObtention}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><CheckCircleOutlined /> Résultat</Space>}>
                                    {demande.resultat}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card title="Institut Associé" className="bg-gray-50">
                            <Descriptions column={1}>
                                <Descriptions.Item label={<Space><BankOutlined /> Nom</Space>}>
                                    {demande.institut?.name || demande.nameInstitut}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
                                    {demande.institut?.email || demande.emailInstitut}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><PhoneOutlined /> Téléphone</Space>}>
                                    {demande.institut?.phone || demande.phoneInstitut}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><EnvironmentOutlined /> Adresse</Space>}>
                                    {demande.institut?.adresse || demande.adresseInstitut}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><EnvironmentOutlined /> Pays</Space>}>
                                    {demande.institut?.paysResidence || demande.paysInstitut}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card title="Information sur le Demandeur" className="bg-gray-50">
                            <Descriptions column={1}>
                                <Descriptions.Item label={<Space><UserOutlined /> Nom</Space>}>
                                    {demande.demandeur.name}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><PhoneOutlined /> Téléphone</Space>}>
                                    {demande.demandeur.phone}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
                                    {demande.demandeur.email}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><EnvironmentOutlined /> Adresse</Space>}>
                                    {demande.demandeur.adresse}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><EnvironmentOutlined /> Pays de Résidence</Space>}>
                                    {demande.demandeur.paysResidence}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {demande.document && (
                            <Card title="Document" className="bg-gray-50">
                                <Descriptions column={1}>
                                    <Descriptions.Item label={<Space><FileTextOutlined /> Type de Document</Space>}>
                                        {demande.document.typeDocument}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<Space><ClockCircleOutlined /> Date d'Obtention</Space>}>
                                        {new Date(demande.document.dateObtention).toLocaleDateString()}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<Space><TrophyOutlined /> Année d'Obtention</Space>}>
                                        {demande.document.anneeObtention}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<Space><CheckCircleOutlined /> Statut</Space>}>
                                        {demande.document.statut}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<Space><FileTextOutlined /> Code ADN</Space>}>
                                        {demande.document.codeAdn}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        )}
                    </div>

                    {fichier && (
                        <Card title="Aperçu du Document" className="mt-8">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <iframe
                                    src={`data:application/pdf;base64,${fichier}`}
                                    width="100%"
                                    height="600px"
                                    title="Document PDF"
                                    className="border rounded"
                                    onLoad={(e) => {
                                        e.target.contentWindow.document.body.addEventListener('contextmenu', (event) => event.preventDefault());
                                    }}
                                />
                            </div>
                        </Card>
                    )}
                </Card>
            </div>
        </>
    );
};

const LoadingSkeleton = () => (
    <div className="container my-6">
        <Card>
            <Skeleton active />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mt-6">
                <Card>
                    <Skeleton active />
                </Card>
                <Card>
                    <Skeleton active />
                </Card>
                <Card>
                    <Skeleton active />
                </Card>
                <Card>
                    <Skeleton active />
                </Card>
            </div>
        </Card>
    </div>
);

const ErrorDisplay = ({ error }) => (
    <Result
        status="error"
        title="Une erreur est survenue"
        subTitle={error}
    />
);

export default DemandeDetails;