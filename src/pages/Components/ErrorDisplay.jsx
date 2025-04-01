function ErrorDisplay({ error }) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary w-full max-w-md">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-red-600 mb-4">Erreur</h3>
                    <p className="text-center">{error}</p>
                </div>
            </div>
        </div>
    )
}

export default ErrorDisplay
