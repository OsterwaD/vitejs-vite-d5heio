import React, { useState, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [result, setResult] = useState('');
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);

  const startScanning = async () => {
    setScanning(true);
    const codeReader = new BrowserMultiFormatReader();
    try {
      const videoInputDevices = await codeReader.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0].deviceId;
      
      codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
        if (result) {
          setScanning(false);
          lookupCode(result.getText());
          codeReader.reset();
        }
        if (err && !(err instanceof TypeError)) {
          console.error(err);
        }
      });
    } catch (err) {
      console.error(err);
      setScanning(false);
    }
  };

  const lookupCode = async (code) => {
    try {
      const response = await fetch(`${API_URL}/api/lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setResult(data.status);
    } catch (error) {
      console.error('Error looking up code:', error);
      setResult('Error occurred');
    }
  };

  return (
    <div className="App">
      <h1>QR Code Scanner</h1>
      <div>
        <button onClick={startScanning} disabled={scanning}>
          {scanning ? 'Scanning...' : 'Start Scanning'}
        </button>
      </div>
      <div>
        <video ref={videoRef} style={{ width: '100%', maxWidth: '500px' }} />
      </div>
      {result && <div>Result: {result}</div>}
    </div>
  );
}

export default App;