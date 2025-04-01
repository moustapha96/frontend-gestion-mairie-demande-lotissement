"use client"

import { useCallback, useState } from "react"
import { User2, MailCheck, MapPin, Phone, Calendar, Save, Loader2, Briefcase, Eye, EyeOff, KeyRound, Camera } from "lucide-react"
import { AdminBreadcrumb, DemandeurBreadcrumb } from "@/components"
import { useAuthContext } from "@/context"
import { toast } from "sonner"
import { cn } from "@/utils"
import { updatePassword, updateUserProfile, uploadProfileImage } from "@/services/userService"
import avatar from "@/assets/avatar.png";
const AdminProfil = () => {
    const { user, saveUser, saveProfilImage } = useAuthContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState({
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        adresse: user.adresse,
        profession: user.profession,
        telephone: user.telephone,
        lieuNaissance: user.lieuNaissance,
        dateNaissance: user.dateNaissance.date,
        numeroElecteur: user.numeroElecteur,
    })
    const [activeTab, setActiveTab] = useState("profile")
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [passwordErrors, setPasswordErrors] = useState({})
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = useCallback(async (event) => {
        const file = event.target.files[0];
        console.log(file)
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Type de fichier non pris en charge");
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("La taille de l'image doit étre inferieur à 5Mo");
            return;
        }

        setIsUploading(true);
        console.log(file)
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('userId', user.id)

            const response = await uploadProfileImage(formData);
            console.log(response)
            if (response && response.avatar) {
                saveProfilImage(response.avatar);
                toast.success("Image mise à jour avec succès");
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error("erreur lors du telechargement de l'image", error);
            toast.error("erreur lors du telechargement de l'image");
        } finally {
            setIsUploading(false);
        }
    }, [user, saveProfilImage]);

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleUpdateUser = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            console.log(userInfo)
            const updatedUser = await updateUserProfile(user.id, userInfo)
            // saveSession({ token: user.token, user: updatedUser })
            saveUser(updatedUser)
            toast.success("Informations de profil mises à jour avec succès")
        } catch (error) {
            console.error("Erreur lors de la mise à jour des informations du profil:", error)
            toast.error("Erreur lors de la mise à jour des informations du profil")
        } finally {
            setIsSubmitting(false)
        }
    }

    const validatePassword = (password) => {
        const errors = []
        if (password.length < 8) {
            errors.push("Le mot de passe doit contenir au moins 8 caractères")
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Au moins une majuscule")
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Au moins une minuscule")
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Au moins un chiffre")
        }
        if (!/[!@#$%^&*]/.test(password)) {
            errors.push("Au moins un caractère spécial (!@#$%^&*)")
        }
        return errors
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        const errors = validatePassword(passwordData.newPassword)

        if (errors.length > 0) {
            setPasswordErrors({ newPassword: errors })
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordErrors({ confirmPassword: ["Les mots de passe ne correspondent pas"] })
            return
        }

        setIsSubmitting(true)
        try {
            const data = {
                ...passwordData,
                userId: user.id
            }
            await updatePassword(user.id, data)
            toast.success("Mot de passe mis à jour avec succès")
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            })
            setPasswordErrors({})
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du mot de passe")
            toast.error(error.response.data.message)
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }


    if (isSubmitting) return <LoadingSkeleton />
    if (error) return <ErrorDisplay error={error} />

    return (
        <>
            <AdminBreadcrumb title="Profil" subTitle="Modifier votre profil" />
            <section>
                <div className="container">
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={cn(
                                        "py-4 px-1 border-b-2 font-medium text-sm",
                                        activeTab === "profile"
                                            ? "border-primary text-primary"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    )}
                                >
                                    Informations du profil
                                </button>
                                <button
                                    onClick={() => setActiveTab("password")}
                                    className={cn(
                                        "py-4 px-1 border-b-2 font-medium text-sm",
                                        activeTab === "password"
                                            ? "border-primary text-primary"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    )}
                                >
                                    Changer le mot de passe
                                </button>
                            </nav>
                        </div>
                    </div>
                    {activeTab === "profile" && (

                        <div className="my-6 space-y-6">
                            <div className="grid grid-cols-1">
                                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                    <div className="p-6">
                                        <h2 className="text-2xl font-semibold mb-4">Profil Utilisateur</h2>

                                        <div className="flex items-center justify-center mb-6">
                                            <div className="relative">
                                                <img
                                                    src={user.avatar ? `data:image/jpeg;base64,${user.avatar}` : avatar}
                                                    alt={"Gestion de la mairie"}
                                                    width={100}
                                                    height={100}
                                                    className="rounded-full object-cover"
                                                />
                                                <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer">
                                                    <Camera size={20} />
                                                </label>
                                                <input
                                                    id="profile-image-upload"
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/gif"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                {isUploading && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                                        <Loader2 className="animate-spin text-white" size={24} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                        <form onSubmit={handleUpdateUser} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Prénom
                                                    </label>
                                                    <div className="relative">
                                                        <User2
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                            size={20}
                                                        />
                                                        <input
                                                            id="prenom"
                                                            name="prenom"
                                                            type="text"
                                                            value={userInfo.prenom}
                                                            onChange={handleInputChange}
                                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Nom
                                                    </label>
                                                    <div className="relative">
                                                        <User2
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                            size={20}
                                                        />
                                                        <input
                                                            id="nom"
                                                            name="nom"
                                                            type="text"
                                                            value={userInfo.nom}
                                                            onChange={handleInputChange}
                                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Email
                                                    </label>
                                                    <div className="relative">
                                                        <MailCheck
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                            size={20}
                                                        />
                                                        <input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            value={userInfo.email}
                                                            onChange={handleInputChange}
                                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Adresse
                                                    </label>
                                                    <div className="relative">
                                                        <MapPin
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                            size={20}
                                                        />
                                                        <input
                                                            id="adresse"
                                                            name="adresse"
                                                            type="text"
                                                            value={userInfo.adresse}
                                                            onChange={handleInputChange}
                                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Profession
                                                    </label>
                                                    <div className="relative">
                                                        <Briefcase
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                            size={20}
                                                        />
                                                        <input
                                                            id="profession"
                                                            name="profession"
                                                            type="text"
                                                            value={userInfo.profession}
                                                            onChange={handleInputChange}
                                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Téléphone
                                                    </label>
                                                    <div className="relative">
                                                        <Phone
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                            size={20}
                                                        />
                                                        <input
                                                            id="telephone"
                                                            name="telephone"
                                                            type="tel"
                                                            value={userInfo.telephone}
                                                            onChange={handleInputChange}
                                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="lieuNaissance" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Lieu de Naissance
                                                    </label>
                                                    <div className="relative">
                                                        <MapPin
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                            size={20}
                                                        />
                                                        <input
                                                            id="lieuNaissance"
                                                            name="lieuNaissance"
                                                            type="text"
                                                            value={userInfo.lieuNaissance}
                                                            onChange={handleInputChange}
                                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Date de Naissance
                                                    </label>
                                                    <div className="relative">
                                                        <Calendar
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                            size={20}
                                                        />
                                                        <input
                                                            id="dateNaissance"
                                                            name="dateNaissance"
                                                            type="date"
                                                            value={userInfo.dateNaissance.split(" ")[0]}
                                                            onChange={handleInputChange}
                                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="numeroElecteur" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Numéro Électeur
                                                    </label>
                                                    <div className="relative">
                                                        <User2
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                            size={20}
                                                        />
                                                        <input
                                                            id="numeroElecteur"
                                                            name="numeroElecteur"
                                                            type="text"
                                                            value={userInfo.numeroElecteur}
                                                            onChange={handleInputChange}
                                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-center">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className={cn(
                                                        "w-1/2 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                                        isSubmitting && "opacity-50 cursor-not-allowed",
                                                    )}
                                                >
                                                    {isSubmitting ? (
                                                        <Loader2 className="animate-spin mr-2" size={20} />
                                                    ) : (
                                                        <Save className="mr-2" size={20} />
                                                    )}
                                                    {isSubmitting ? "Mise à jour..." : "Mettre à jour le profil"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "password" && (
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Changer le mot de passe</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mot de passe actuel
                                            </label>
                                            <div className="relative">
                                                <KeyRound
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                    size={20}
                                                />
                                                <input
                                                    type={showPassword.current ? "text" : "password"}
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData(prev => ({
                                                        ...prev,
                                                        currentPassword: e.target.value
                                                    }))}
                                                    className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => ({
                                                        ...prev,
                                                        current: !prev.current
                                                    }))}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                >
                                                    {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nouveau mot de passe
                                            </label>
                                            <div className="relative">
                                                <KeyRound
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                    size={20}
                                                />
                                                <input
                                                    type={showPassword.new ? "text" : "password"}
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData(prev => ({
                                                        ...prev,
                                                        newPassword: e.target.value
                                                    }))}
                                                    className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => ({
                                                        ...prev,
                                                        new: !prev.new
                                                    }))}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                >
                                                    {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                            {passwordErrors.newPassword && (
                                                <ul className="mt-2 text-sm text-red-600 space-y-1">
                                                    {passwordErrors.newPassword.map((error, index) => (
                                                        <li key={index} className="flex items-center">
                                                            <span className="mr-2">•</span>
                                                            {error}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <div className="mt-2 text-sm text-gray-500">
                                                Le mot de passe doit contenir :
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Au moins 8 caractères</li>
                                                    <li>Au moins une majuscule</li>
                                                    <li>Au moins une minuscule</li>
                                                    <li>Au moins un chiffre</li>
                                                    <li>Au moins un caractère spécial (!@#$%^&*)</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirmer le nouveau mot de passe
                                            </label>
                                            <div className="relative">
                                                <KeyRound
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                    size={20}
                                                />
                                                <input
                                                    type={showPassword.confirm ? "text" : "password"}
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData(prev => ({
                                                        ...prev,
                                                        confirmPassword: e.target.value
                                                    }))}
                                                    className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => ({
                                                        ...prev,
                                                        confirm: !prev.confirm
                                                    }))}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                >
                                                    {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                            {passwordErrors.confirmPassword && (
                                                <p className="mt-2 text-sm text-red-600">{passwordErrors.confirmPassword[0]}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={cn(
                                                "w-1/2 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                                isSubmitting && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="animate-spin mr-2" size={20} />
                                            ) : (
                                                <Save className="mr-2" size={20} />
                                            )}
                                            {isSubmitting ? "Mise à jour..." : "Changer le mot de passe"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

function LoadingSkeleton() {
    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="h-9 w-64 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="flex items-center space-x-3 mt-4">
                                            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

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

export default AdminProfil


