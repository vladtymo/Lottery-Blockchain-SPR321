import { useState } from 'react'
import { connectWallet, callContractFunction } from "./blockchainUtils";

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [account, setAccount] = useState(null);

  const handleConnect = async () => {
    const signer = await connectWallet();
    if (signer) {
      const address = await signer.getAddress();
      setAccount(address);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <button onClick={handleConnect}>
        {account ? `Connected: ${account}` : "Connect MetaMask"}
      </button>
      <button onClick={callContractFunction} disabled={!account}>
        Call Contract
      </button>
    </>
  )
}

export default App
