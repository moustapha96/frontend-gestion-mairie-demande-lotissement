"use client"

import { LuSearch, LuChevronLeft, LuChevronRight, LuFileText } from "react-icons/lu"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { cn } from "@/utils"
import { getDemandesDemandeur } from "@/services/demandeService"
import { useAuthContext } from "@/context"
import { Loader2 } from "lucide-react"

const DemandeListe = () => {
  const { user } = useAuthContext()
  const [demandes, setDemandes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const data = await getDemandesDemandeur(user.id)
        console.log(data)
        setDemandes(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDemandes()
  }, [user.id])

  // if (loading) return <div className="flex justify-center items-center h-screen">Chargement des demandes...</div>
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>

  const filteredDemandes = demandes.filter(
    (demande) =>
      demande.typeDemande.toLowerCase().includes(filter.toLowerCase()) ||
      demande.demandeur.nom.toLowerCase().includes(filter.toLowerCase()) ||
      demande.demandeur.prenom.toLowerCase().includes(filter.toLowerCase()),
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDemandes.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleFileView = (filePath) => {
    // Implement file viewing logic here
    window.open(filePath, "_blank")
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h4 className="text-xl font-semibold text-gray-800 uppercase">Liste des Demandes</h4>
      </div>

      <div className="p-6">
        <div className="flex mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher par type de demande ou demandeur..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type de Demande
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date de Création
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Localité
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
              {currentItems.map((demande) => (
                <tr key={demande.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{demande.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{demande.typeDemande}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(demande.dateCreation).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        demande.statut === "VALIDE"
                          ? "bg-green-100 text-green-800"
                          : demande.statut === "REJETE"
                            ? "bg-red-100 text-red-800"
                            : demande.statut === "EN_COURS"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800",
                      )}
                    >
                      {demande.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {demande.localite ? demande.localite.nom : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/demandeur/demandes/${demande.id}/details`}
                        className="text-primary hover:text-primary-700 transition-colors duration-200"
                      >
                        Détails
                      </Link>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {loading && (
              <tbody className="w-full">
                <tr>
                  <td colSpan="5" className="px-6 py-12">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredDemandes.length)} sur{" "}
            {filteredDemandes.length} entrées
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
            {Array.from({ length: Math.ceil(filteredDemandes.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={cn(
                  "px-3 py-1 rounded-md",
                  currentPage === index + 1 ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50",
                )}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredDemandes.length / itemsPerPage)}
              className={cn(
                "px-3 py-1 rounded-md",
                currentPage === Math.ceil(filteredDemandes.length / itemsPerPage)
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
  )
}

export default DemandeListe

