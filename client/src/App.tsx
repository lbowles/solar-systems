import logo from './logo.svg';
import './App.css';
import { ConnectButton } from './components/ConnectButton/ConnectButton';
import { GreeterState } from './components/GreeterState/GreeterState';
import { useProvider, useSigner } from 'wagmi';
import { providers } from 'ethers'

function App() {
  const provider = useProvider()

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>
          <ConnectButton></ConnectButton>
        </div>
        <div>{provider && <GreeterState></GreeterState>}</div>
      </header>
    </div>
  );
}

export default App;
