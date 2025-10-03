import { LuMoveRight } from "react-icons/lu"
import { valuableAssets } from "../data"
import AssetCard from "./AssetCard"
import { Link } from "react-router-dom"

const ValuableAssets = () => {
  return (
    <section id="resources" className="py-10 lg:py-20">
      <div className="container">
        <div className="flex items-end justify-center mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Nos Ressources</span>
            <h2 className="text-4xl font-medium text-default-950 mt-4">Ressources Pratiques</h2>
          </div>
        </div>
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {valuableAssets.map((asset, idx) => (
            <div key={idx} className="bg-white border border-default-200 rounded-xl p-6">
              <img src={asset.image} alt={asset.title} className="w-full h-48 object-cover rounded-t-xl" />
              <h3 className="text-xl font-medium text-default-950 mt-4">{asset.title}</h3>
              <p className="text-base mt-2">{asset.description}</p>
              <div className="group mt-5">
                <Link to="" className="inline-flex items-center justify-center gap-2 rounded-full py-2 px-4 bg-primary/20 text-primary text-sm transition-all duration-200 hover:bg-primary hover:text-white">
                  En savoir plus
                  <LuMoveRight className="w-6 h-6 inline-block" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ValuableAssets