function DocumentInfoCard({ document }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{"Document"}</h3>
                <div className="space-y-4">
                    <InfoItem icon={<FileText className="w-5 h-5" />} label={"Type document"} value={document.type} />
                    <InfoItem icon={<FileText className="w-5 h-5" />} label={"Date de renseignement"} value={document.date} />
                </div>
            </div>
        </div>
    )
}

export default DocumentInfoCard