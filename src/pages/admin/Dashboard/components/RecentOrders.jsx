import { useState } from 'react'
import { CheckCircle, Package, Truck, XCircle } from 'lucide-react'
import { cn } from "@/utils"

export default function RecentOrders({ orders = [] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem)


  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'sale':
        return 'Confirmé';
      case 'cancel':
        return 'Annulé';
      case 'draft':
        return 'Brouillon';
      default:
        return 'En cours';
    }
  };


  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'sale':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancel':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'draft':
        return <Package className="w-4 h-4 text-yellow-500" />
      default:
        return <Truck className="w-4 h-4 text-blue-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'sale':
        return 'text-green-500 bg-green-100'
      case 'cancel':
        return 'text-red-500 bg-red-100'
      case 'draft':
        return 'text-yellow-500 bg-yellow-100'
      default:
        return 'text-blue-500 bg-blue-100'
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h4 className="text-lg font-semibold text-gray-900">Commandes Récentes</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {order.partner_name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.date_order).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {order.amount_total.toLocaleString()} FCFA
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                    getStatusColor(order.state)
                  )}>
                    {getStatusIcon(order.state)}
                    <span className="ml-1 capitalize">{getStatusText(order.state)}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length > itemsPerPage && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(orders.length / itemsPerPage)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, orders.length)}</span> sur{' '}
                <span className="font-medium">{orders.length}</span> résultats
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Précédent</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === Math.ceil(orders.length / itemsPerPage)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Suivant</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}