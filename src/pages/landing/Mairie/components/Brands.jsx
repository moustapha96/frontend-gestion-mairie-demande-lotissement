import { FreeMode, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import brand1 from "@/assets/images/brand/1.png";
import brand2 from "@/assets/images/brand/2.png";
import brand3 from "@/assets/images/brand/3.png";
import brand4 from "@/assets/images/brand/4.png";
import brand5 from "@/assets/images/brand/5.png";
import brand6 from "@/assets/images/brand/6.png";

const brands = [brand1, brand2, brand3, brand4, brand5, brand6];
const Brands = () => {
  return (
    <section className="py-10 lg:py-20">
      <div className="container">
        <Swiper
          modules={[Thumbs, FreeMode]}
          slidesPerView={1}
          spaceBetween={30}
          centeredSlides
          loop
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            400: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
          }}
          id="testimonial_directory"
        >
          {brands.map((brand, idx) => (
            <SwiperSlide key={idx}>
              <img src={brand} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Brands;
