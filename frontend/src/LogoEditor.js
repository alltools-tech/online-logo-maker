import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { SketchPicker } from 'react-color';

const fonts = [
  'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Comic Sans MS', 'Impact'
];

const LogoEditor = () => {
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState('#007bff');
  const [selectedFont, setSelectedFont] = useState('Arial');

  useEffect(() => {
    const canvas = new fabric.Canvas('logo-canvas', {
      width: 400,
      height: 300,
      backgroundColor: '#fff',
    });
    canvasRef.current = canvas;

    // Select object and update color/font controls
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);

    return () => canvas.dispose();
  }, []);

  // Handle selection for color/font controls
  const handleSelection = (e) => {
    const obj = e.selected[0];
    if (obj && obj.type === 'textbox') {
      setSelectedColor(obj.fill || '#007bff');
      setSelectedFont(obj.fontFamily || 'Arial');
    }
  };

  // Add Text
  const addText = () => {
    const canvas = canvasRef.current;
    const text = new fabric.Textbox('Logo Text', {
      left: 100,
      top: 100,
      fontSize: 32,
      fill: selectedColor,
      fontFamily: selectedFont,
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
      fill: selectedColor,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  // Change Color
  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    const canvas = canvasRef.current;
    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      if (activeObj.type === 'textbox' || activeObj.type === 'rect') {
        activeObj.set('fill', color.hex);
        canvas.renderAll();
      }
    }
  };

  // Change Font
  const handleFontChange = (e) => {
    const font = e.target.value;
    setSelectedFont(font);
    const canvas = canvasRef.current;
    const activeObj = canvas.getActiveObject();
    if (activeObj && activeObj.type === 'textbox') {
      activeObj.set('fontFamily', font);
      canvas.renderAll();
    }
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
        <button className="btn btn-warning me-2" onClick={exportSVG}>Export SVG</button>
      </div>

      {/* Color Picker */}
      <div className="mb-2">
        <label><b>Color:</b></label>
        <SketchPicker color={selectedColor} onChange={handleColorChange} />
      </div>

      {/* Font Picker */}
      <div className="mb-2">
        <label><b>Font:</b></label>
        <select value={selectedFont} onChange={handleFontChange} className="form-select" style={{width: 200}}>
          {fonts.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      <canvas id="logo-canvas" style={{ border: '1px solid #ddd' }} />
    </div>
  );
};

export default LogoEditor;