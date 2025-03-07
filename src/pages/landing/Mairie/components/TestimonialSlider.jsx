import { LuMoveLeft, LuMoveRight, LuStar } from "react-icons/lu";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLayoutContext } from "@/context";

import bgLine from "@/assets/images/other/bg-lines-2.png";
import bgLineDark from "@/assets/images/other/bg-lines-2-dark.png";

import { testimonialSlides } from "../data";

import "swiper/css";
import "swiper/css/navigation";

const TestimonialSlider = () => {
  const { themeMode } = useLayoutContext();
  return (
    <section id="testimonial">
      <div className="container">
        <div className="bg-default-100 dark:bg-default-50">
          <div
            className="py-20 bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url(${
                themeMode == "light" ? bgLine : bgLineDark
              })`,
            }}
          >
            <div className="relative">
              <div className="max-w-2xl mx-auto text-center mb-12">
                <h2 className="md:text-4xl text-3xl font-medium text-default-950">
                  Explore the feedback from our clients.
                </h2>
              </div>
              <Swiper
                modules={[Thumbs, FreeMode, Navigation]}
                loop
                navigation={{
                  nextEl: ".testimonials-button-next",
                  prevEl: ".testimonials-button-prev",
                }}
                className="testimonials relative"
              >
                {testimonialSlides.map((slide, idx) => {
                  return (
                    <SwiperSlide className="swiper-slide" key={idx}>
                      <div className="max-w-4xl mx-auto text-center">
                        <div className="p-6">
                          <img
                            src={slide.image}
                            className="h-14 w-14 rounded-full mx-auto"
                          />
                          <h3 className="text-xl font-medium text-default-950 mt-5">
                            {slide.name}
                          </h3>
                          <p className="text-base">{slide.location}</p>
                          <p className="md:text-2xl mt-4 text-default-800">
                            "{slide.description}"
                          </p>
                          <div className="flex items-center justify-center gap-2 mt-4">
                            {Array.from(new Array(5)).map((_val, idx) => {
                              return (
                                <LuStar
                                  key={idx}
                                  className="h-5 w-5 stroke-yellow-300"
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <div className="absolute top-1/2 start-0 -translate-y-1/2 translate-x-1/2 z-10">
                <div className="testimonials-button-prev">
                  <div className="relative cursor-pointer">
                    <span className="absolute -start-1.5 w-8 h-8 top-1/2 -translate-y-1/2 border-2 -z-10 rounded-full border-primary" />
                    <LuMoveLeft className="h-10 w-10 text-default-950" />
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 end-0 -translate-y-1/2 -translate-x-1/2 z-10">
                <div className="testimonials-button-next">
                  <div className="relative cursor-pointer">
                    <span className="absolute -end-1.5 w-8 h-8 top-1/2 -translate-y-1/2 border-2 -z-10 rounded-full border-primary" />
                    <LuMoveRight className="h-10 w-10 text-default-950" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
