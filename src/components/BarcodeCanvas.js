import { fabric } from 'fabric';
import JsBarcode from 'jsbarcode';
import React, { useEffect, useRef } from 'react';

const BarcodeCanvas = ({ barcodeValue }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current);
    const barcodeOptions = {
      format: 'CODE128', // Specify the barcode format you want
      displayValue: false, // Set to true if you want to display the barcode value
    };
    const barcodeCanvas = document.createElement('canvas');

    JsBarcode(barcodeCanvas, barcodeValue, barcodeOptions);

    const barcodeImage = new fabric.Image(barcodeCanvas, {
      left: 10, // Set the desired position of the barcode image
      top: 10,
    });

    canvas.add(barcodeImage);
  }, [barcodeValue]);

  return <canvas ref={canvasRef} />;
};

export default BarcodeCanvas;
