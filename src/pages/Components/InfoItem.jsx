function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 text-gray-400">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-sm text-gray-900">{value || "N/A"}</p>
            </div>
        </div>
    )
}

export default InfoItem