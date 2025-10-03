const MarqueeGroup = () => {
  return (
    <section>
      <div className="relative gap-28 m-auto flex overflow-hidden bg-default-100 dark:bg-default-50 py-4">
        <div className="marquee__group gap-28 flex items-center justify-around flex-shrink-0 min-w-full">
          <h2 className="text-4xl font-normal text-default-950">Services Municipaux</h2>
          <h2 className="text-4xl font-normal text-default-950">Urbanisme</h2>
          <h2 className="text-4xl font-normal text-default-950">Environnement</h2>
          <h2 className="text-4xl font-normal text-default-950">Éducation</h2>
          <h2 className="text-4xl font-normal text-default-950">Culture</h2>
        </div>
        <div aria-hidden="true" className="marquee__group gap-28 flex items-center justify-around flex-shrink-0 min-w-full">
          <h2 className="text-4xl font-normal text-default-950">Services Municipaux</h2>
          <h2 className="text-4xl font-normal text-default-950">Urbanisme</h2>
          <h2 className="text-4xl font-normal text-default-950">Environnement</h2>
          <h2 className="text-4xl font-normal text-default-950">Éducation</h2>
          <h2 className="text-4xl font-normal text-default-950">Culture</h2>
        </div>
      </div>
    </section>
  );
};

export default MarqueeGroup;
