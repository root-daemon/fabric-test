/* eslint-disable default-case */
import { fabric } from 'fabric';
import JsBarcode from 'jsbarcode';
import React, { useEffect, useRef, useState } from 'react';
import preloadImage from '../images/images.png';

const FabricComponent = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [textFields, setTextFields] = useState([]);
  const [barcodeValue, setBarcodeValue] = useState('123123');

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

    // Grid Snapping function
    fabricCanvas.on('object:moving', function (options) {
      if (
        Math.round((options.target.left / grid) * 4) % 4 === 0 &&
        Math.round((options.target.top / grid) * 4) % 4 === 0
      ) {
        options.target
          .set({
            left: Math.round(options.target.left / grid) * grid,
            top: Math.round(options.target.top / grid) * grid,
          })
          .setCoords();
      }
    });

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.forEachObject((object) => {
        console.log('canvas', canvas);
      });
    }
  }, [canvas]);
  useEffect(() => {
    if (canvas) {
      updateBarcode();
    }
  }, [barcodeValue]);

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

  const handleStaticTextField = (caseName) => {
    let textContent = 'default';

    switch (caseName) {
      case 'case1':
        textContent = 'case1';
        break;
      case 'case2':
        textContent = 'case2';
        break;
      default:
        textContent = 'default';
        break;
    }

    const staticTextField = new fabric.IText(textContent, {
      left: 5,
      top: 5,
      width: 200,
      fontSize: 16,
      borderColor: 'black',
      editable: false,
      lockMovementX: false,
      lockMovementY: false,
      selectable: true,
    });
    canvas.add(staticTextField);
    setTextFields((prevTextFields) => [...prevTextFields, staticTextField]);
    canvas.setActiveObject(staticTextField);
    canvas.renderAll();
  };

  const handleExportClick = () => {
    const jsonData = JSON.stringify(canvas.toJSON());
    console.log(jsonData);
  };

  const handleImageClick = () => {
    const imgObj = new Image();
    imgObj.src = preloadImage;
    imgObj.onload = function () {
      const image = new fabric.Image(imgObj);
      image.set({
        top: 50,
        left: 50,
      });
      canvas.add(image);
      canvas.renderAll();
    };
  };

  const handleAddLine = () => {
    const rect = new fabric.Rect({
      left: 50,
      top: 50,
      width: canvas.width,
      height: (canvas.height / 100) * 5,
      fill: 'black',
    });
    canvas.add(rect);
  };

  const dtGetStyle = (object, styleName) => {
    return object[styleName];
  };

  const dtSetStyle = (object, styleName, value) => {
    object[styleName] = value;
    object.set({ dirty: true });
    canvas.renderAll();
  };

  const handleAddBarcode = () => {
    updateBarcode();
  };
  const updateBarcode = () => {
    canvas.forEachObject(function (object) {
      if (object.type === 'image' && object.source === 'barcode') {
        canvas.remove(object);
      }
    });

    const barcodeOptions = {
      format: 'CODE128',
      displayValue: false,
    };
    const barcodeCanvas = document.createElement('canvas');
    JsBarcode(barcodeCanvas, barcodeValue, barcodeOptions);

    const barcodeImage = new fabric.Image(barcodeCanvas, {
      left: 10,
      top: 10,
      source: 'barcode',
    });

    canvas.add(barcodeImage);
    canvas.renderAll();
  };

  return (
    <div>
      <canvas id="c" width={500} height={500} ref={canvasRef}></canvas>
      <button onClick={() => dtEditText('underline')} id="btn-underline">
        Underline
      </button>
      <button onClick={() => dtEditText('bold')} id="btn-bold">
        Bold
      </button>
      <button onClick={() => dtEditText('italic')} id="btn-italic">
        Italic
      </button>
      <button onClick={handleAddTextField}>New Text Field</button>
      <button onClick={handleExportClick}>Export Data</button>
      <button onClick={() => handleStaticTextField('case1')}>Case 1</button>
      <button onClick={() => handleStaticTextField('case2')}>Case 2</button>
      <button onClick={handleImageClick}>Add Image</button>
      <button onClick={handleAddLine}>Add Line</button>
      <button onClick={handleAddBarcode}>Barcode</button>
      <input
        type="text"
        value={barcodeValue}
        onChange={(e) => setBarcodeValue(e.target.value)}
      />
    </div>
  );
};

export default FabricComponent;
