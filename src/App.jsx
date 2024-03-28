import { useState } from "react";
import { ethers, BrowserProvider } from "ethers";
import "./index.css";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

// Update with the contract address logged out to the CLI when it was deployed
// const greeterAddress = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"; //Localhost
const greeterAddress = "0xD050609675958C10258474C29FD3c808787B578a"; //Alfajores

const App = () => {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState();

  // request access to the user's MetaMask account
  const requestAccount = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  // call the smart contract, read the current greeting value
  const fetchGreeting = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        web3provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  };

  // call the smart contract, send an update
  const setGreeting = async () => {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const web3provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      console.log(greeting);
      fetchGreeting();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button> <br /> <hr />
        <button onClick={setGreeting}>Set Greeting</button> <br /> <hr />
        <input
          onChange={(e) => {
            // console.log(e.target.value);
            setGreetingValue(e.target.value);
          }}
          placeholder="Set greeting"
        />
      </header>
      <h2>{greeting}</h2>
    </div>
  );
};
export default App;
