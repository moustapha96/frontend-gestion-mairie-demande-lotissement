import { PageMetaData, TopNavBar } from "@/components"
import Hero from "./components/Hero"
import MarqueeGroup from "./components/MarqueeGroup"
import Feature1 from "./components/Feature1"
import ValuableAssets from "./components/ValuableAssets"
import ArticlesPage from "./components/ArticlePage"
import Contact from "./components/Contact"
import { menuItems } from "@/assets/data"
import Portfolio from "./components/Portfolio"
import HeroSwiper from "./components/HeroSwiper"
import BusinessSolutions from "./components/BusinessSolutions"
import ContactUs from "./components/ContactUs"
import { Home } from "lucide-react"
import HomeHome from "./components/Home"

const Finance = () => {
  return (
    <>
      <PageMetaData title="Mairie de Kaolack Commune" />

      {/* <TopNavBar menuItems={["accueil", "services", "ressources", "actualités", "nouvelle-demande", "contact"]} position="fixed" /> */}


      <TopNavBar
        menuItems={menuItems}
        hasDownloadButton
        position="fixed"
      />

      <HomeHome />

      {/* <Hero /> */}

      {/* <HeroSwiper /> */}

      <MarqueeGroup />

      <BusinessSolutions id="solutions" />


      <Feature1  id="resources"/>


      {/* <ArticlesPage /> */}

      <Portfolio />

      {/* <OnBoarding /> */}

      {/* <Experts /> */}


      {/* <SearchPlan /> */}

      {/* <Contact /> */}

      <ContactUs />
    </>

  )
}

export default Finance