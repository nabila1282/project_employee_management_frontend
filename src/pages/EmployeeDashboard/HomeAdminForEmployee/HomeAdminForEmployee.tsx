import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import img1 from '../../../../src/assets/sl-1 5.jpg';
import img2 from '../../../../src/assets/sl-1.jpg';
import img3 from '../../../../src/assets/sl-3.jpg';

export default function HomeAdminForEmployee() {
    const carouselStyle = {
        height: '200px', // Set the fixed height for the carousel
    };

    return (
        <div>

            <Carousel
                style={carouselStyle}

                autoPlay={true} // Enable auto sliding
                interval={3000} // Set the interval in milliseconds (e.g., 1000ms or 1s)
            >
                <div>
                    <img src={img1} alt="Image 1" />
                    <p className="legend">Employee Management Dashboard</p>
                </div>
                <div>
                    <img src={img2} alt="Image 2" />
                    <p className="legend">Employee Management Dashboard</p>
                </div>
                <div>
                    <img src={img3} alt="Image 3" />
                    <p className="legend">Employee Management Dashboard</p>
                </div>
            </Carousel>
        </div>
    );
}
