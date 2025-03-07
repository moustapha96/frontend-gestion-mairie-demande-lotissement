import { LuFacebook, LuInstagram, LuLinkedin, LuTwitter } from "react-icons/lu";

export const footerLinks = [
  {
    title: "Liens utiles",
    items: [
      {
        name: "A propos", link: "A propos" ,  page: false
      },
      {
        name: "Nos Services",link : "Nos Services" ,  page: false
      },
      {
        name: "Tarification",link : "Tarification" ,  page: false
      },
      {
        name: "Contact",link :  "Contact" ,  page: false
      },
    ],
  },


  {
    title: "Social Media",
    items: [
      {
        name: "Facebook",
        icon: LuFacebook,
      },
      {
        name: "Instagram",
        icon: LuInstagram,
      },
      {
        name: "Twitter",
        icon: LuTwitter,
      },
      {
        name: "Linkedin",
        icon: LuLinkedin,
      },
    ],
  },
  {
    title: "Mentions légales",
    items: [
      {
        name: "politique de confidentialité",link : "/privacy-policy" , page: true
      },
      {
        name: "Conditions générales",link: "/terms-and-conditions" , page: true
      },
      
    ],
  },
];

export const landingPages = [
  {
    name: "Agency",
    link: "/landing/agency",
  },
  {
    name: "Agency Two",
    link: "/landing/agency-2",
  },
  {
    name: "Charity",
    link: "/landing/charity",
  },
  {
    name: "Company",
    link: "/landing/company",
  },
  {
    name: "Creative",
    link: "/landing/creative",
  },
  {
    name: "Ebook",
    link: "/landing/ebook",
  },
  {
    name: "Finance",
    link: "/landing/finance",
  },
  {
    name: "Hosting",
    link: "/landing/hosting",
  },
  {
    name: "Marketing",
    link: "/landing/marketing",
  },
  {
    name: "Marketing 2",
    link: "/landing/marketing-2",
  },
  {
    name: "Marketing 3",
    link: "/landing/marketing-3",
  },
  {
    name: "Photography",
    link: "/landing/photography",
  },
  {
    name: "Portfolio",
    link: "/landing/portfolio",
  },
  {
    name: "Portfolio 2",
    link: "/landing/portfolio-2",
  },
  {
    name: "Startup",
    link: "/landing/startup",
  },
  {
    name: "Web Designer",
    link: "/landing/web-designer",
  },
];
