import React from 'react';
import "../styles/animated_text.css"; // CSS from the next step

const AnimatedLoadingText = ({ text }) => {
  return (
    <h3 className="loading loading07">
      {text.split('').map((char, index) => (
        <span
          key={index}
          data-text={char}
          style={{ '--i': index }}
        >
          {char}
        </span>
      ))}
    </h3>
  );
};

export default AnimatedLoadingText;
