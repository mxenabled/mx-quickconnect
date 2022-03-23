import logo from './logo.svg';
import './App.css';
import LaunchButton from "./components/LaunchButton";
import UsersList from "./components/UsersList";
import Identity from "./components/Identity";
import Auth from "./components/Auth";
import Balances from "./components/Balances";
import Transactions from "./components/Transactions";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>MX quickstart app</p>
      </header>
      <div className="body">
        <UsersList />
        <LaunchButton />
        <Auth />
        <Identity />
        <Balances />
        <Transactions />
      </div>
    </div>
  );
}

export default App;
