import logo from './logo.svg';
import './App.css';
import { ConnectButton } from './components/ConnectButton/ConnectButton';
// import { GreeterState } from './components/GreeterState/GreeterState';
import { useProvider, useSigner } from 'wagmi';
import { providers } from 'ethers'
import { Home } from './components/Home/Home';

function App() {
  const provider = useProvider()

  return (
    <div className="App">
      <ConnectButton></ConnectButton>
      <Home></Home>
    </div>
  );
}

export default App;
