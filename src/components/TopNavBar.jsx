// import { toSentenceCase } from "@/helpers";
// import { cn } from "@/utils";
// import { useEffect, useRef, useState } from "react";
// import { LuLogIn, LuMenu, LuX, LuChevronDown } from "react-icons/lu";
// import { Link, useLocation } from "react-router-dom";
// import logo from "@/assets/logo_200X200.png";
// import frFlag from "@/assets/images/landing/hosting/fr.png";
// import enFlag from "@/assets/images/landing/hosting/en.png";
// import itFlag from "@/assets/images/landing/hosting/it.png";

// const translations = {
//   fr: { Connexion: "Connexion" },
//   en: { Connexion: "Login" },
//   it: { Connexion: "Accedi" },
// };

// const TopNavBar = ({ menuItems, position }) => {
//   const navbarRef = useRef(null);
//   const { hash } = useLocation();
//   const [activation, setActivation] = useState(menuItems[0]);
//   const [language, setLanguage] = useState(localStorage.getItem("language") || "fr");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLanguageChange = (lang) => {
//     setLanguage(lang);
//     localStorage.setItem("language", lang);
//     setShowDropdown(false);
//   };

//   const translate = (key) => translations[language][key] || key;

//   const flags = { fr: frFlag, en: enFlag, it: itFlag };

//   useEffect(() => {
//     const handleScroll = () => {
//       activeSection();
//       if (navbarRef.current) {
//         if (window.scrollY >= 80) navbarRef.current.classList.add("nav-sticky");
//         else navbarRef.current.classList.remove("nav-sticky");
//       }
//     };

//     document.addEventListener("scroll", handleScroll);
//     activeSection();

//     const timeout = setTimeout(() => {
//       if (hash) {
//         const element = document.querySelector(hash);
//         if (element) element.scrollIntoView({ behavior: "instant" });
//       }
//     }, 0);

//     return () => {
//       clearTimeout(timeout);
//       document.removeEventListener("scroll", handleScroll);
//     };
//   }, [hash, menuItems]);

//   const activeSection = () => {
//     const scrollY = window.scrollY;
//     for (let i = menuItems.length - 1; i >= 0; i--) {
//       const section = menuItems[i];
//       const el = document.getElementById(section);
//       if (el && el.offsetTop <= scrollY + 100) {
//         setActivation(section);
//         return;
//       }
//     }
//   };

//   return (
//     <header
//       ref={navbarRef}
//       id="navbar"
//       className={cn(
//         position,
//         "fixed inset-x-0 top-0 z-50 w-full border-b dark:bg-primary-dark bg-white transition-all duration-300 ease-in-out"
//       )}
//     >
//       <div className="flex h-full items-center py-4 px-4">
//         <div className="container mx-auto flex items-center justify-between">
//           <Link to="/">
//             <img src={logo} alt="Logo" className="h-10" />
//           </Link>

//           {/* Bouton menu mobile */}
//           <button
//             className="lg:hidden text-gray-800 focus:outline-none   dark:text-white "
//             onClick={() => setMenuOpen(!menuOpen)}
//           >
//             {menuOpen ? <LuX size={30} /> : <LuMenu size={30} />}
//           </button>

//           {/* Menu desktop */}
//           <ul className="hidden lg:flex space-x-6">
//             {menuItems.map((item, idx) => (
//               <li key={idx} className={cn("text-gray-800 hover:text-primary", activation === item && "font-bold")}>

//                 {item === "nouvelle-demande" ? <>
//                   <a href={`/${item}`} className="capitalize">
//                     {toSentenceCase(item)}
//                   </a>
//                 </> : <>
//                   <a href={`/#${item}`} className="capitalize">
//                     {toSentenceCase(item)}
//                   </a>
//                 </>}
//               </li>
//             ))}
//           </ul>

//           <div className="hidden lg:flex items-center space-x-4">
//             {/* <button
//               className="relative flex items-center space-x-2 text-gray-800"
//               onClick={() => setShowDropdown(!showDropdown)}
//             >
//               <img src={flags[language]} alt="Langue" className="w-6 h-4" />
//               <LuChevronDown />
//             </button>
//             {showDropdown && (
//               <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md">
//                 {Object.keys(flags).map((lang) => (
//                   <button
//                     key={lang}
//                     className="block w-full px-4 py-2 text-left hover:bg-gray-100"
//                     onClick={() => handleLanguageChange(lang)}
//                   >
//                     <img src={flags[lang]} alt={lang} className="inline w-5 h-3 mr-2" />
//                     {lang.toUpperCase()}
//                   </button>
//                 ))}
//               </div>
//             )} */}
//             <Link to="/auth/sign-in" className="bg-primary px-4 py-2 text-white rounded-lg">
//               {translate("Connexion")}
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Menu mobile */}
//       {menuOpen && (
//         <div className="lg:hidden absolute top-16 left-0 w-full bg-white shadow-md dark:bg-primary-dark">
//           <ul className="flex flex-col items-center py-4 space-y-4">
//             {menuItems.map((item, idx) => (
//               <li key={idx} className="text-gray-800  dark:text-white">
//                 {item == "nouvelle-demande" ? <>
//                   <a href={`/${item}`} className="capitalize" onClick={() => setMenuOpen(false)}>
//                     {toSentenceCase(item)}
//                   </a>
//                 </> : <>
//                   <a href={`/#${item}`} className="capitalize" onClick={() => setMenuOpen(false)}>
//                     {toSentenceCase(item)}
//                   </a>
//                 </>}
//               </li>
//             ))}
//           </ul>
//           <div className="flex justify-center py-2">
//             <Link to="/auth/sign-in" className="bg-primary px-6 py-2 text-white rounded-lg ">
//               {translate("Connexion")}
//             </Link>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default TopNavBar;


import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo_200X200.png";

const TopNavBar = ({ menuItems, position }) => {

  const navbarRef = useRef(null);
  const { hash } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        if (window.scrollY >= 80) {
          navbarRef.current.classList.add("nav-sticky");
        } else {
          navbarRef.current.classList.remove("nav-sticky");
        }
      }
    };

    document.addEventListener("scroll", handleScroll);

    const timeout = setTimeout(() => {
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "instant" });
        }
      }
    }, 0);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [hash]);

  return (
    <header
      ref={navbarRef}
      id="navbar"
      className={cn(
        position,
        "fixed inset-x-0 top-0 z-50 w-full border-b dark:bg-primary-dark bg-white transition-all duration-300 ease-in-out"
      )}
    >
      <div className="flex h-full items-center py-4 px-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10" />
          </Link>

          {/* Bouton menu mobile */}
          <button
            className="lg:hidden text-gray-800 focus:outline-none dark:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <LuX size={30} /> : <LuMenu size={30} />}
          </button>

          {/* Menu desktop */}
          <ul className="hidden lg:flex space-x-6">
            {menuItems.map((item, idx) => (
              <li
                key={idx}
                className="text-gray-800 hover:text-primary dark:text-white"
              >
                {item.page ? (
                  <Link to={item.link} className="capitalize">
                    {item.name}
                  </Link>
                ) : typeof item.link === "string" ? (
                  <a href={item.link} className="capitalize">
                    {item.name}
                  </a>
                ) : (
                  <span className="capitalize text-gray-400 cursor-not-allowed">
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* Connexion bouton */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/auth/sign-in"
              className="bg-primary px-4 py-2 text-white rounded-lg"
            >
              Connexion
            </Link>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white shadow-md dark:bg-primary-dark">
          <ul className="flex flex-col items-center py-4 space-y-4">
            {menuItems.map((item, idx) => (
              <li key={idx} className="text-gray-800 dark:text-white">
                {item.page ? (
                  <Link
                    to={item.link}
                    className="capitalize"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : typeof item.link === "string" ? (
                  <a
                    href={item.link}
                    className="capitalize"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <span className="capitalize text-gray-400 cursor-not-allowed">
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="flex justify-center py-2">
            <Link
              to="/auth/sign-in"
              className="bg-primary px-6 py-2 text-white rounded-lg"
            >
              Connexion
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNavBar;
