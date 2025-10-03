
import { Link } from "react-router-dom";
import { LuMoveRight, LuPlay, LuStar } from "react-icons/lu";
import { FaQuoteRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import finance from '@/assets/image_105.png';
// import finance from '@/assets/serigne-mboup.jpeg';
import financeBackground from '@/assets/images/landing/finance/bg-1.png';
import avatar1 from '@/assets/images/avatars/img-1.jpg';
import avatar3 from '@/assets/images/avatars/img-3.jpg';
import 'swiper/css';

const slideImages = [avatar1, avatar3];

const Hero = () => {
  return (
    <>
      <section id="accueil" className="md:py-20 flex items-center justify-center relative overflow-hidden bg-cover bg-gradient-to-l from-primary/5 to-primary/10 via-primary/0">
        <div className="container">
          <div className="grid lg:grid-cols-2 grid-cols-1 2xl:gap-20">
            <div className="pt-[132px] pb-20">
              <h2 className="text-3xl xl:text-5xl/tight font-medium text-default-950">
                Bienvenue à la Mairie de Kaolack
              </h2>
              <p className="sm:text-lg mt-6">
                Découvrez les services et les actualités de la mairie de Kaolack. Nous sommes là pour vous servir et vous accompagner dans vos démarches administratives.
              </p>
              <div className="flex flex-wrap items-center mt-10 gap-6">
                <Link to="/#services" className="inline-flex items-center justify-center gap-2 text-base py-3 px-10 rounded-full text-white bg-primary hover:bg-primary-700 transition-all duration-700">
                  Découvrir nos services
                  <LuMoveRight className="h-6 w-6" />
                </Link>
                <button className="relative flex items-center justify-center gap-4 text-base group" data-hs-overlay="#watchvideomodal">
                  <span className="h-12 w-12 flex items-center justify-center gap-4 rounded-full text-base font-medium bg-primary/40 text-primary transition-all duration-300 ring-4 ring-primary/20 group-hover:bg-primary/80 group-hover:text-white">
                    <LuPlay className="h-5 w-5" />
                  </span>
                  <span className="text-base font-medium">Voir la vidéo de présentation</span>
                </button>
              </div>
            </div>
            <div>
              <div className="relative opacity-100 z-20">
                <img src={finance} className="h-[700px] rounded-b-full mx-auto" alt="Mairie de Kaolack" />


              </div>
            </div>
          </div>
        </div>
      </section>
      <div id="watchvideomodal" className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 duration-500 mt-0 opacity-0 ease-in-out transition-all sm:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="flex flex-col w-full pointer-events-auto rounded-xl overflow-x-hidden">
            <iframe className="w-full" height={400} src="https://www.youtube.com/watch?v=VnKfj8NjXRc" title="Présentation de la mairie de Kaolack" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
