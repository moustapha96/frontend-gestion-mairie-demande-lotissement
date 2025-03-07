import { FreeMode, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { cn } from "@/utils";

import "swiper/css";

const ProjectSwiper = ({ slides, bgBlack }) => {
  return (
    <Swiper
      modules={[Thumbs, FreeMode]}
      slidesPerView={1}
      spaceBetween={30}
      centeredSlides
      loop
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      breakpoints={{
        400: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
      }}
      className="rounded-md relative"
    >
      {slides.map((slide, idx) => {
        return (
          <SwiperSlide key={idx}>
            <div className="relative group rounded-3xl overflow-hidden">
              <img src={slide.image} className="h-full w-full" />
              <div
                className={cn("absolute inset-0", bgBlack && "bg-black/40")}
              />
              <div className="absolute inset-x-0 top-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700">
                <div className="text-center">
                  <h5 className="inline-block text-xl font-medium text-white bg-black py-1 px-3 mb-1">
                    {slide.title}
                  </h5>{" "}
                  <br />
                  <h2 className="inline-block text-2xl font-medium text-white bg-black py-1 px-3">
                    {slide.subTitle}
                  </h2>
                </div>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ProjectSwiper;
