import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

const ColorPalette = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000'); // Initial color

  const handleClick = () => {
    setShowPicker(!showPicker);
  };

  const handleChange = (color) => {
    setSelectedColor(color.hex);
  };

  const handleLogColor = () => {
    console.log('Selected Color:', selectedColor);
  };

  return (
    <div>
      <button onClick={handleClick}>Show Color Palette</button>
      {showPicker && (
        <div>
          <ChromePicker
            color={selectedColor}
            onChange={handleChange}
            disableAlpha
            presetColors={[
              '#000000',
              '#FFFFFF',
              '#FF0000',
              '#00FF00',
              '#0000FF',
              '#FFFF00',
              '#FF00FF',
              '#00FFFF',
            ]}
          />
          <div
            style={{
              backgroundColor: selectedColor,
              width: '50px',
              height: '50px',
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ColorPalette;
