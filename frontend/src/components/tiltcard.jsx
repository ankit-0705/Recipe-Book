import React, { useRef, useEffect } from 'react';
import VanillaTilt from 'vanilla-tilt';

const TiltCard = () => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      VanillaTilt.init(cardRef.current, {
        max: 20,
        speed: 400,
        glare: true,
        'max-glare': 0.15,
        scale: 1.05,
        reset: true,
      });
    }

    return () => {
      if (cardRef.current?.vanillaTilt) {
        cardRef.current.vanillaTilt.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="w-full max-w-md bg-base-100 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_4px_#22c55e] overflow-hidden rounded-xl"
    >
      <figure className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-xl">
        <img
          src="https://img.freepik.com/premium-photo/exploding-food-illustration_949611-1887.jpg"
          alt="recipe_book"
          className="w-full h-full object-cover"
        />
      </figure>
    </div>
  );
};

export default TiltCard;
