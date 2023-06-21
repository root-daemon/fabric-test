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
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
    });
    setCanvas(fabricCanvas);

    // Add grid lines to canvas
    const grid = 50;
    for (let i = 0; i < 600 / grid; i++) {
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

    // Enable grid snapping
    fabricCanvas.on('object:moving', (options) => {
      const target = options.target;
      if (target && target.get('type') === 'i-text') {
        const left = Math.round(target.left / grid) * grid;
        const top = Math.round(target.top / grid) * grid;
        target.set({ left, top }).setCoords();
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
      tl: true,
      tr: true,
      br: true,
      bl: true,
      mtr: true,
    });

    canvas.add(textField);
    setTextFields((prevTextFields) => [...prevTextFields, textField]);
    canvas.setActiveObject(textField);
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
    canvas.forEachObject((object) => {
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

  const uploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const imgObj = new Image();
        imgObj.src = e.target.result;

        imgObj.onload = () => {
          const fabricImage = new fabric.Image(imgObj);
          canvas.add(fabricImage);
          canvas.renderAll();
        };
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <canvas id="c" width={500} height={500} ref={canvasRef}></canvas>

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
      <input type="file" accept="image/*" onChange={uploadImage} />
    </div>
  );
};

export default FabricComponent;
