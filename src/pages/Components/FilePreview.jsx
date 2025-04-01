function FilePreview({ file, title }) {
    const fileType = file.startsWith('/9j/') ? 'image/jpeg'
        : file.startsWith('iVBORw0KGgo') ? 'image/png'
            : 'application/pdf'

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
                <div className="bg-gray-200 rounded-lg p-4">
                    {fileType.startsWith('image/') ? (
                        <img
                            src={`data:${fileType};base64,${file}`}
                            alt={title}
                            className="w-full h-auto max-h-[400px] object-contain"
                        />
                    ) : (
                        <iframe
                            src={`data:application/pdf;base64,${file}`}
                            title={title}
                            className="w-full h-[400px]"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default FilePreview