import './App.css';
import BarcodeCanvas from './components/BarcodeCanvas';
import ColorPalette from './components/ColorPallete';
import FabricComponent from './components/FabricComponent';

function App() {
  const barcodeValue = '123456789';
  return (
    <div>
      {/* <BarcodeCanvas barcodeValue={barcodeValue} /> */}
      <FabricComponent />
      <ColorPalette />
    </div>
  );
}

export default App;
