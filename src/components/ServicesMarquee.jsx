const ServicesMarquee = () => {
  return (
    <div className="relative gap-28 m-auto flex overflow-hidden border border-default-200 py-6">
      <div className="marquee__group gap-28 flex items-center justify-around flex-shrink-0 min-w-full">
        <div className="py-2">
          <h2 className="text-4xl font-medium text-default-950">
            UI-UX Experience
          </h2>
        </div>
        <div className="py-2">
          <h2 className="text-4xl font-medium text-default-950">
            Web Development
          </h2>
        </div>
        <div className="py-2">
          <h2 className="text-4xl font-medium text-default-950">
            Digital Marketing
          </h2>
        </div>
        <div className="py-2">
          <h2 className="text-4xl font-medium text-default-950">
            Product Design
          </h2>
        </div>
        <div className="py-2">
          <h2 className="text-4xl font-medium text-default-950">
            Mobile Solutions
          </h2>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="marquee__group gap-28 flex items-center justify-around flex-shrink-0 min-w-full"
      >
        <div className="py-2">
          <h2 className="text-4xl font-medium text-default-950">
            UI-UX Experience
          </h2>
        </div>
        <div className="py-2">
          <h2 className="text-4xl font-medium text-default-950">
            Web Development
          </h2>
        </div>
        <div className="py-2">
          <h2 className="text-4xl font-medium text-default-950">
            Digital Marketing
          </h2>
        </div>
        <div className="py-2">
          <h2 className="text-4xl font-medium text-default-950">
            Product Design
          </h2>
        </div>
        <div className="py-2">
          <h2 className="text-4xl font-medium text-default-950">
            Mobile Solutions
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ServicesMarquee;
