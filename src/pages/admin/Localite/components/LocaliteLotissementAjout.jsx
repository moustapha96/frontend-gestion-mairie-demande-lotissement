
"use client"
import { AdminBreadcrumb } from "@/components"
import { createLocalite, getLocaliteDetails } from "@/services/localiteService"
import { createLotissement } from "@/services/lotissementService"
import { cn } from "@/utils"

import { Loader2, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { Form, Input, Select, Button, Space, DatePicker } from "antd"


const AdminLocaliteLotissementAjouter = () => {
    const { id } = useParams();
    const { TextArea } = Input;
    const { Option } = Select;

    const [form] = Form.useForm();
    const [localite, setLocalite] = useState(null)
    const [nom, setNom] = useState("")
    const [localisation, setLocalisation] = useState("")
    const [description, setDescription] = useState("")
    const [statut, setStatut] = useState("en cours")
    const [dateCreation, setDateCreation] = useState(new Date().toISOString().slice(0, 16))
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {

        const fetchLocalite = async () => {
            try {
                const res = await getLocaliteDetails(id)
                setLocalite(res);
            } catch (error) {
                console.error(error);
            }
        };

        fetchLocalite();
    }, [id])

   

    const handleSubmit = async (values) => {
        console.log(values)
        setLoading(true)
        try {
            const body = {
                nom: values.nom,
                localisation: values.localisation ?? null,
                description: values.description ?? null,
                statut: values.statut,
                dateCreation: new Date().toLocaleDateString(),
                longitude: values.longitude ?? null,
                latitude: values.latitude ?? null,
                localiteId: id
            }
            console.log(body)
            const res = await createLotissement(body);
            console.log(res)
            toast.success("Lotissement ajouté avec succès!");
            form.resetFields();
            navigate(`/admin/quartiers/${id}/details`)
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'ajout du lotissement");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchLocalite = async () => {
            try {
                const res = await getLocaliteDetails(id)
                setLocalite(res);
                form.setFieldsValue({
                    dateCreation: new Date(),
                    statut: "en cours"
                });
            } catch (error) {
                console.error(error);
                toast.error("Erreur lors du chargement de la Quartier");
            }
        };

        fetchLocalite();
    }, [id, form])

    const handleCancel = () => {
        form.resetFields();
        navigate(`/admin/quartiers/${id}/details`);
    };

    return (
        <>
            <AdminBreadcrumb title="Nouveau lotissement" />
            <section className="flex justify-center items-center min-h-screen">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-2xl">
                    <h2 className="text-2xl font-bold text-center ">Ajouter un nouveau lotissement</h2>

                    <div className="flex justify-center items-center text-2xl font-bold  " >
                        {localite ? <>
                            <span>
                                Quartier :
                            </span>
                            <span className=" text-primary text-center ml-3 ">
                                <Link to={`/admin/quartiers/${localite.id}/details`} >
                                    {localite.nom}
                                </Link>
                            </span>
                        </> : <>
                            <Loader2 className="animate-spin mr-2 text-center mt-6" size={20} />
                        </>}
                    </div>
                    <div className="p-6">
                        
                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            <Form.Item name="nom" label="Nom" rules={[{ required: true, message: "Le nom est requis" }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="localisation"
                                label="Localisation"
                               
                            >
                                <Input />
                            </Form.Item>



                            <Form.Item
                                name="longitude"
                                label="Longitude"
                                
                            >
                                <Input type="number" />
                            </Form.Item>

                            <Form.Item
                                name="latitude"
                                label="Latitude"
                            >
                                <Input type="number" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Description"
                            >
                                <TextArea rows={3} />
                            </Form.Item>

                            <Form.Item
                                name="statut"
                                label="Statut"
                                rules={[{ required: true, message: "Le statut est requis" }]}
                                initialValue="en cours"
                            >
                                <Select>
                                    <Option value="en cours">En cours</Option>
                                    <Option value="planifié">Planifié</Option>
                                    <Option value="achevé">Achevé</Option>
                                </Select>
                            </Form.Item>

                            {/* <Form.Item name="dateCreation" label="Date de création">
                                <Input type="datetime-local" disabled defaultValue={new Date().toISOString().slice(0, 16)} />
                            </Form.Item> */}

                            <Form.Item className="flex justify-center">
                                <Space>
                                    <Button onClick={handleCancel}>Annuler</Button>
                                    <Button

                                        htmlType="submit"
                                        loading={loading}
                                        disabled={loading}
                                        className={cn("ant-btn-primary ", loading && "opacity-50")}
                                        icon={
                                            loading ? (
                                                <Loader2 className="animate-spin mr-2" size={16} />
                                            ) : (
                                                <Save className="mr-2" size={16} />
                                            )
                                        }
                                    >
                                        {loading ? "Enregistrement" : "Ajouter le lotissement"}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>

                    </div>
                </div>
            </section>
        </>
    )
}

export default AdminLocaliteLotissementAjouter
