
import { experts } from "../data"
import ExpertCard from "./ExpertCard"

const Experts = () => {
  return (
    <section id="experts" className="py-10 lg:py-20">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Nos Experts</span>
            <h2 className="text-4xl font-medium text-default-950 mt-4">Rencontrez nos spécialistes en gestion foncière</h2>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-px overflow-hidden rounded-xl">
          {experts.map((expert, idx) => (
            <ExpertCard expert={expert} key={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experts
