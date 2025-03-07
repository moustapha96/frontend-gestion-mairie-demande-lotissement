import { AdminBreadcrumb } from "@/components"

import { LuSearch, LuChevronLeft, LuChevronRight, LuFilter } from "react-icons/lu"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { cn } from "@/utils"
import { useAuthContext } from "@/context/useAuthContext"
import { getClientsEntreprise } from "@/services/entrepriseFunctionService"
import { setCompteEnable, setValidationAdhesion } from "../../../services/entrepriseFunctionService"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const AdminClient = () => {
    const { isAuthenticated, userInfo, parent } = useAuthContext()
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)

    const [filters, setFilters] = useState({
        name: "",
        email: "",
        function: "",
        phone: "",
        adhesion: "",
    })

    useEffect(() => {
        if (userInfo && parent) {
            fetchClients(userInfo.id, parent.id)
        }
    }, [userInfo, parent])

    console.log(userInfo, parent)
    console.log("userinfo")

    const fetchClients = async (idPartner, idParent) => {
        setLoading(true)
        try {
            const res = await getClientsEntreprise({ partner_id: idPartner, parent_id: idParent })
            const filtered = res.filter((client) => client.id !== userInfo.id)
            setClients(filtered)
            console.log(res)
            console.log("clients", clients)
        } catch (error) {
            console.error("Error fetching clients:", error)
            setError("Une erreur est survenue lors du chargement des clients.")
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="flex justify-center items-center h-screen">Chargement des clients...</div>
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>

    const filteredClients = clients.filter(
        (client) =>
            (filters.name === "" || client.name.toLowerCase().includes(filters.name.toLowerCase())) &&
            (filters.email === "" || client.email.toLowerCase().includes(filters.email.toLowerCase())) &&
            (filters.function === "" ||
                (client.function && client.function.toLowerCase().includes(filters.function.toLowerCase()))) &&
            (filters.phone === "" || client.partner_phone.toLowerCase().includes(filters.phone.toLowerCase())) &&
            (filters.adhesion === "" || client.adhesion.toLowerCase() === filters.adhesion.toLowerCase()),
    )

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
        setCurrentPage(1)

        console.log(key, value)
    }

    const handleMultipleFilters = (filterValues) => {
        setFilters((prev) => ({ ...prev, ...filterValues }))
        setCurrentPage(1)
    }

    const resetFilters = () => {
        setFilters({
            name: "",
            email: "",
            function: "",
            phone: "",
            adhesion: "",
        })
        setCurrentPage(1)
    }

    const handleStatusChange = async (clientId, newStatus) => {
        if (!window.confirm("Confirmer la modification du statut du client ?")) {
            return
        }

        const res = await setCompteEnable(clientId)
        if (res) {
            toast.success("Compte activé avec succes")
            fetchClients(userInfo.id)
        }
        console.log(`Desable client ${clientId}`)
    }

    const handleStatusAdhesion = async (clientId, newStatus) => {
        if (!window.confirm("Confirmer la modification du statut du client ?")) {
            return
        }
        setLoadingStatus(true)
        const resultat = await setValidationAdhesion(clientId, newStatus)
        if (resultat) {
            toast.success("Opération reussie.", {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
            })
            fetchClients(userInfo.id, parent.id)
        } else {
            toast.error("Une erreur s'est produite lors de la modification du statut.", {
                position: "top-right",
                autoClose: 5000,
            })
        }
        setLoadingStatus(false)
    }

    const getAdhesionColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-300"
            case "accepted":
                return "bg-green-100 text-green-800 border-green-300"
            case "rejected":
                return "bg-red-100 text-red-800 border-red-300"
            default:
                return "bg-gray-100 text-gray-800 border-gray-300"
        }
    }

    return (
        <>
            <AdminBreadcrumb title="Liste des clients" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Filtrer par nom"
                                                value={filters.name}
                                                onChange={(e) => handleFilterChange("name", e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                            <LuFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Filtrer par email"
                                                value={filters.email}
                                                onChange={(e) => handleFilterChange("email", e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                            <LuFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Filtrer par fonction"
                                                value={filters.function}
                                                onChange={(e) => handleFilterChange("function", e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                            <LuFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Filtrer par téléphone"
                                                value={filters.phone}
                                                onChange={(e) => handleFilterChange("phone", e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                            <LuFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                        <div className="relative">
                                            <select
                                                value={filters.adhesion}
                                                onChange={(e) => handleFilterChange("adhesion", e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                                            >
                                                <option value="">Tous les statuts</option>
                                                <option value="pending">En cours</option>
                                                <option value="accepted">Accepté</option>
                                                <option value="rejected">Rejeté</option>
                                            </select>
                                            <LuFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <button
                                                onClick={resetFilters}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                            >
                                                Réinitialiser les filtres
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        ID
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Nom
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Email
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Poste
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Téléphone
                                                    </th>
                                                    {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th> */}
                                                    {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th> */}
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Adhésion
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {currentItems.map((client) => (
                                                    <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            #{client.id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {client.function ? client.function : "Non défini"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {client.partner_phone}
                                                        </td>
                                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.country_name}</td> */}

                                                        <td className="px-6 py-4 whitespace-nowrap text-sm ">
                                                            {loadingStatus ? (
                                                                <Loader2 className="animate-spin mr-2" />
                                                            ) : (
                                                                <>
                                                                    <select
                                                                        className={`block w-full pl-3 pr-10 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${getAdhesionColor(client.adhesion)}`}
                                                                        value={client.adhesion}
                                                                        onChange={(e) => handleStatusAdhesion(client.id, e.target.value)}
                                                                    >
                                                                        {loadingStatus ? (
                                                                            <option>
                                                                                {" "}
                                                                                <Loader2 className="animate-spin mr-2" />
                                                                            </option>
                                                                        ) : (
                                                                            <>
                                                                                <option value="pending">En cours</option>
                                                                                <option value="accepted">Accepté</option>
                                                                                <option value="rejected">Rejeté</option>
                                                                            </>
                                                                        )}
                                                                    </select>
                                                                </>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex  gap-2 ">
                                                            <Link
                                                                to={`/admin/clients/${client.id}/details`}
                                                                className="text-primary hover:text-primary transition-colors duration-200"
                                                            >
                                                                Détails
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-sm text-gray-700">
                                            Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredClients.length)} sur{" "}
                                            {filteredClients.length} entrées
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={cn(
                                                    "px-3 py-1 rounded-md",
                                                    currentPage === 1
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-white text-gray-700 hover:bg-gray-50",
                                                )}
                                            >
                                                <LuChevronLeft className="h-5 w-5" />
                                            </button>
                                            {Array.from({ length: Math.ceil(filteredClients.length / itemsPerPage) }).map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => paginate(index + 1)}
                                                    className={cn(
                                                        "px-3 py-1 rounded-md",
                                                        currentPage === index + 1
                                                            ? "bg-primary text-white"
                                                            : "bg-white text-gray-700 hover:bg-gray-50",
                                                    )}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === Math.ceil(filteredClients.length / itemsPerPage)}
                                                className={cn(
                                                    "px-3 py-1 rounded-md",
                                                    currentPage === Math.ceil(filteredClients.length / itemsPerPage)
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-white text-gray-700 hover:bg-gray-50",
                                                )}
                                            >
                                                <LuChevronRight className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AdminClient

