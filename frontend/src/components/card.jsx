import React, { useRef, useEffect } from 'react';
import VanillaTilt from 'vanilla-tilt';

function Card(props) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      VanillaTilt.init(cardRef.current, {
        max: 20,
        speed: 400,
        glare: true,
        'max-glare': 0.2,
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
      className="bg-gray-800/40 shadow-lg rounded-xl p-6 transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_4px_#22c55e]"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/1046/1046751.png"
        alt="choose meals"
        className="w-20 h-20 mx-auto mb-4"
      />
      <h3 className="text-xl font-semibold mb-2">{props.heading}</h3>
      <p className="text-gray-600">{props.info}</p>
    </div>
  );
}

export default Card;