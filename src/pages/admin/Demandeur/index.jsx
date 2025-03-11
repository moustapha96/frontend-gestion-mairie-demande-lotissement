

"use client"
import { AdminBreadcrumb } from "@/components"
import { LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { cn } from "@/utils"
import { getDemandeurListe } from "@/services/userService"
import { Loader2 } from "lucide-react"
import { formatPhoneNumber } from "@/utils/formatters"

const AdminDemandeurListe = () => {
  const [demandeurs, setDemandeurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  useEffect(() => {
    const fetchDemandeurs = async () => {
      try {
        const data = await getDemandeurListe()
        setDemandeurs(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDemandeurs()
  }, [])

  // if (loading) return <div className="flex justify-center items-center h-screen">Chargement des demandeurs...</div>
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>

  const filteredDemandeurs = demandeurs.filter(demandeur =>
    demandeur.nom.toLowerCase().includes(filter.toLowerCase()) ||
    demandeur.prenom.toLowerCase().includes(filter.toLowerCase()) ||
    demandeur.email.toLowerCase().includes(filter.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDemandeurs.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <>
      <AdminBreadcrumb title="Liste des demandeurs" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="bg-white dark:bg-default-50 shadow-lg rounded-lg overflow-hidden">

              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white">Liste des Demandeurs</h4>
              </div>
              <div className="p-6">
                <div className="flex mb-4 justify-center">
                  <div className="relative w-full max-w-md">
                    <input
                      type="text"
                      placeholder="Rechercher par nom, prénom ou email..."
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
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((demandeur) => (
                        <tr key={demandeur.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{demandeur.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{demandeur.nom}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{demandeur.prenom}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{demandeur.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> {formatPhoneNumber(demandeur.telephone)} </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link to={`/admin/demandeur/${demandeur.id}/details`} className="text-primary hover:text-primary transition-colors duration-200">
                              Détails
                            </Link>
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
                    Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredDemandeurs.length)} sur {filteredDemandeurs.length} entrées
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={cn(
                        "px-3 py-1 rounded-md",
                        currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <LuChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: Math.ceil(filteredDemandeurs.length / itemsPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={cn(
                          "px-3 py-1 rounded-md",
                          currentPage === index + 1 ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === Math.ceil(filteredDemandeurs.length / itemsPerPage)}
                      className={cn(
                        "px-3 py-1 rounded-md",
                        currentPage === Math.ceil(filteredDemandeurs.length / itemsPerPage) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
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
      </section>
    </>
  )
}

export default AdminDemandeurListe
