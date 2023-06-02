/* eslint-disable default-case */
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const FabricComponent = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [textFields, setTextFields] = useState([]);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current);

    setCanvas(fabricCanvas);
    // Add text to canvas
    var grid = 50;
    // create grid
    for (var i = 0; i < 600 / grid; i++) {
      fabricCanvas.add(
        new fabric.Line([i * grid, 0, i * grid, 600], {
          stroke: '#ccc',
          selectable: false,
        })
      );
      fabricCanvas.add(
        new fabric.Line([0, i * grid, 600, i * grid], {
          stroke: '#ccc',
          selectable: false,
        })
      );
    }

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const handleAddTextField = () => {
    const textField = new fabric.IText('Text', {
      left: 5,
      top: 5,
      width: 200,
      fontSize: 16,
      borderColor: 'black',
      editable: true,
      lockMovementX: false,
      lockMovementY: false,
      selectable: true,
    });

    textField.setControlsVisibility({
      tl: true, // Top-left
      tr: true, // Top-right
      br: true, // Bottom-right
      bl: true, // Bottom-left
      mtr: true, // Middle-rotation
    });

    canvas.add(textField);
    setTextFields((prevTextFields) => [...prevTextFields, textField]);
    canvas.setActiveObject(textField);
    canvas.renderAll();
  };
  const dtEditText = (action) => {
    const a = action;
    const o = canvas.getActiveObject();
    let t;

    // If object selected, what type?
    if (o) {
      t = o.get('type');
    }

    if (o && t === 'i-text') {
      switch (a) {
        case 'bold':
          const isBold = dtGetStyle(o, 'fontWeight') === 'bold';
          dtSetStyle(o, 'fontWeight', isBold ? '' : 'bold');
          break;

        case 'italic':
          const isItalic = dtGetStyle(o, 'fontStyle') === 'italic';
          dtSetStyle(o, 'fontStyle', isItalic ? '' : 'italic');
          break;

        case 'underline':
          const isUnderline = dtGetStyle(o, 'textDecoration') === 'underline';
          dtSetStyle(o, 'textDecoration', isUnderline ? '' : 'underline');
          break;
      }
    }
    canvas.renderAll();
  };

  const dtGetStyle = (object, styleName) => {
    return object[styleName];
  };

  const dtSetStyle = (object, styleName, value) => {
    object[styleName] = value;
    object.set({ dirty: true });
    canvas.renderAll();
  };

  return (
    <div>
      <canvas id="c" ref={canvasRef}></canvas>
      <button onClick={() => dtEditText('underline')} id="btn-underline">
        Underline
      </button>
      <button onClick={() => dtEditText('bold')} id="btn-bold">
        Bold
      </button>
      <button onClick={() => dtEditText('italic')} id="btn-italic">
        Italic
      </button>
      <button onClick={handleAddTextField}>new text Field</button>
    </div>
  );
};

export default FabricComponent;
