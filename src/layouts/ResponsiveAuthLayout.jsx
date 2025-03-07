import { ReactNode } from 'react'
import { Link } from 'react-router-dom'


import authBgImg from "@/assets/images/other/auth-bg.jpg";
import logoLight from "@/assets/images/logo-light.png";
import otherAuthImg from "@/assets/images/other/auth-img.jpg";
import logoAuthenticPage from "@/assets/logo_authentic_page.png";
import logoAuthenticPageDark from "@/assets/logo_authentic_page_dark.png";
import logo from "@/assets/logo_200X200.png";

export default function ResponsiveAuthLayout({ children, title }) {
    return (
        // <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        //     <div className="sm:mx-auto sm:w-full sm:max-w-md">
        //         <div className="flex justify-center">
        //             <Link href="/">
        //                 {/* <Image
        //                     src="/placeholder.svg?height=80&width=80"
        //                     alt="Logo"
        //                     width={80}
        //                     height={80}
        //                     className="mx-auto h-12 w-auto"
        //                 /> */}
        //                 <img
        //                     src={logoAuthentic}
        //                     className="object-contain h-full w-full"
        //                     alt="Authentic Logo"
        //                 />
        //             </Link>
        //         </div>
        //         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
        //     </div>

        //     <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        //         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        //             {children}
        //         </div>
        //     </div>
        // </div>


        <div className="min-h-screen m-8 bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-4xl flex flex-col items-center">

                <div className="w-full bg-gray-200 rounded shadow-lg z-0 mt-16 p-4">
                    <h2 className="text-center md:text-lg lg:text-3xl font-extrabold text-gray-900">{title}</h2>
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}