import { Link } from "react-router-dom"

const ExpertCard = ({ expert }) => {
  return (
    <div className="bg-default-100 dark:bg-default-50">
      <div className="sm:p-10 p-8">
        <div className="flex items-center gap-5 mb-6">
          <img src={expert.image} className="h-14 rounded-full" />
          <div>
            <Link to="">
              <h4 className="text-xl font-medium text-default-950">{expert.name}</h4>
            </Link>
            <p className="text-base">{expert.position}</p>
          </div>
        </div>
        <p className="text-base text-default-900">"{expert.description}"</p>
      </div>
    </div>
  )
}

export default ExpertCard