import { PageMetaData, TopNavBar } from "@/components"
import Hero from "./components/Hero"
import MarqueeGroup from "./components/MarqueeGroup"
import Feature1 from "./components/Feature1"
import ValuableAssets from "./components/ValuableAssets"
import ArticlesPage from "./components/ArticlePage"
import Contact from "./components/Contact"
import { menuItems } from "@/assets/data"

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

      <Hero />

      <MarqueeGroup />

      <Feature1 />

      <ValuableAssets />

      <ArticlesPage />


      {/* <OnBoarding /> */}
      {/* <Experts /> */}


      {/* <SearchPlan /> */}

      <Contact />
    </>

  )
}

export default Finance