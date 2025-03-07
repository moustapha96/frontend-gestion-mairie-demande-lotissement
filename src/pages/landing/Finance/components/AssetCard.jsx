import { Link } from "react-router-dom"
import { LuMoveRight } from "react-icons/lu"

const AssetCard = ({ asset }) => {
  return (
    <div className="border border-default-200 rounded-lg overflow-hidden group">
      <div className="relative group overflow-hidden">
        <div className="overflow-hidden">
          <img src={asset.image} className="h-full w-full scale-[1.2] group-hover:scale-[1.05] transition-all duration-700" />
        </div>
        <div className="p-6">
          <h2 className="text-xl font-medium text-default-950 transition-all duration-700">{asset.title}</h2>
          <p className="text-base my-4">{asset.description}</p>
          <Link to="" className="inline-flex items-center justify-center gap-2 rounded-full py-2 px-4 bg-primary/20 text-primary text-sm transition-all duration-200 hover:bg-primary hover:text-white">Read More
            <LuMoveRight className="w-6 h-6 inline-block" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AssetCard