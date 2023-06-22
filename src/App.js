import './App.css';
import BarcodeCanvas from './components/BarcodeCanvas';
import ColorPalette from './components/ColorPallete';
import FabricComponent from './components/FabricComponent';
import FileInput from './components/FileInput';

function App() {
  const barcodeValue = '123456789';
  return (
    <div>
      {/* <BarcodeCanvas barcodeValue={barcodeValue} /> */}
      <FabricComponent />
      <ColorPalette />
      <FileInput />
    </div>
  );
}

export default App;
