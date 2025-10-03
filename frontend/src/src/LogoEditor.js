import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const LogoEditor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize Fabric canvas
    const canvas = new fabric.Canvas('logo-canvas', {
      width: 400,
      height: 300,
      backgroundColor: '#fff',
    });

    // Save canvas instance for export
    canvasRef.current = canvas;

    // Cleanup on unmount
    return () => {
      canvas.dispose();
    };
  }, []);

  // Add Text
  const addText = () => {
    const canvas = canvasRef.current;
    const text = new fabric.Textbox('Logo Text', {
      left: 100,
      top: 100,
      fontSize: 32,
      fill: '#007bff',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  // Add Rectangle Shape
  const addRect = () => {
    const canvas = canvasRef.current;
    const rect = new fabric.Rect({
      left: 50,
      top: 50,
      width: 100,
      height: 60,
      fill: '#28a745',
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  // Export as PNG
  const exportPNG = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });
    downloadURI(dataURL, 'logo.png');
  };

  // Export as SVG
  const exportSVG = () => {
    const canvas = canvasRef.current;
    const svgData = canvas.toSVG();
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    downloadURI(url, 'logo.svg');
  };

  // Utility function to download
  const downloadURI = (uri, name) => {
    const link = document.createElement('a');
    link.href = uri;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="mb-2">
        <button className="btn btn-primary me-2" onClick={addText}>Add Text</button>
        <button className="btn btn-success me-2" onClick={addRect}>Add Rectangle</button>
        <button className="btn btn-info me-2" onClick={exportPNG}>Export PNG</button>
        <button className="btn btn-warning" onClick={exportSVG}>Export SVG</button>
      </div>
      <canvas id="logo-canvas" style={{ border: '1px solid #ddd' }} />
    </div>
  );
};

export default LogoEditor;
