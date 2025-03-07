

import React, { useEffect, useState } from 'react';
import { AdminBreadcrumb } from "@/components";
import { getAllContact } from "../../../services/contactService";

const AdminContact = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [contacts, setContacts] = useState([]);


    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [documentsPerPage] = useState(10);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await getAllContact();
            console.log(response);
            setContacts(response);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement des configurations");
        } finally {
            setLoading(false);
        }
    };




    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(filter.toLowerCase()) ||
        contact.email.toLowerCase().includes(filter.toLowerCase())
    );

    const indexOfLastContact = currentPage * documentsPerPage;
    const indexOfFirstContact = indexOfLastContact - documentsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);





    return (
        <>
            <AdminBreadcrumb title="Liste des Contacts" />
            {loading ? (
                <div>Chargement...</div>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <section>
                    <div className="container">
                        <div className="my-6 space-y-6">
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                    <h4 className="text-xl font-semibold text-gray-800 uppercase">Liste des contacts</h4>
                                </div>
                                <div className="p-6">
                                    <div className="flex mb-4">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                placeholder="Rechercher par nom ou email..."
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
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {currentContacts.map((contact) => (
                                                    <tr key={contact.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{contact.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.subject}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.object}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {/* Vous pouvez ajouter ici votre logique de pagination */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};


export default AdminContact;
