const Preloader = () => {
  return (
    <div className="absolute left-0 flex w-full items-start p-0 top-0 z-70">
      <div className="top-0 h-1 w-full animate-[load_1s_normal_forwards] rounded-full bg-primary shadow-[0_10px_40px_-10px_#fff]"></div>
    </div>
  );
};

export default Preloader;
