import React from 'react'
import Slider from "react-slick";
import { Image } from 'antd';

const SliderComponent = ({ arrImages }) => {
      const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 1500,
      };
      return (
            <Slider {...settings} style={{ width: '1300px' }}>
                  {arrImages.map((image) => {
                        return (
                              <Image key={image} src={image} alt='slider' preview={false} width='1300px' height='375px' />
                        )
                  })}
            </Slider>
      )
}

export default SliderComponent