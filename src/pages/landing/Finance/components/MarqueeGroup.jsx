
const MarqueeGroup = () => {
  return (
    <section>
      <div className="relative gap-28 m-auto flex overflow-hidden bg-default-100 dark:bg-default-50 py-4">
        <div className="marquee__group gap-28 flex items-center justify-around flex-shrink-0 min-w-full">
          <h2 className="text-4xl font-normal text-default-950">UI-UX Experience</h2>
          <h2 className="text-4xl font-normal text-default-950">Web Development</h2>
          <h2 className="text-4xl font-normal text-default-950">Digital Marketing</h2>
          <h2 className="text-4xl font-normal text-default-950">Product Design</h2>
          <h2 className="text-4xl font-normal text-default-950">Mobile Solutions</h2>
        </div>
        <div aria-hidden="true" className="marquee__group gap-28 flex items-center justify-around flex-shrink-0 min-w-full">
          <h2 className="text-4xl font-normal text-default-950">UI-UX Experience</h2>
          <h2 className="text-4xl font-normal text-default-950">Web Development</h2>
          <h2 className="text-4xl font-normal text-default-950">Digital Marketing</h2>
          <h2 className="text-4xl font-normal text-default-950">Product Design</h2>
          <h2 className="text-4xl font-normal text-default-950">Mobile Solutions</h2>
        </div>
      </div>
    </section>
  )
}

export default MarqueeGroup