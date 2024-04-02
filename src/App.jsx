import { useState } from "react";
import { ethers, BrowserProvider } from "ethers";
import "./index.css";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";

// Update with the contract address logged out to the CLI when it was deployed
// const greeterAddress = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"; //Localhost
const greeterAddress = "0xd3f26Ba4771a1e8590632531a4Be4338c0F14725"; //Alfajores
const tokenAddress = "0x41A929e65F6733fEe64A293aD5A1CA3b8A0854BF"; //Alfajores

const App = () => {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState();
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();

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

  // call the smart contract to set new Greeting update
  const setGreeting = async () => {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const web3provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      setGreetingValue(" ");
      console.log(greeting);
      fetchGreeting();
    }
  };

  // Call the smart contract to get the balance of the user wallet
  const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const web3provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        tokenAddress,
        Token.abi,
        web3provider
      );
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  };

  // Call the smart contract to send token

  const sendToken = async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const web3provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transation = await contract.transfer(userAccount, amount);
      await transation.wait();
      console.log(`${amount} Token successfully sent to ${userAccount}`);
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
          placeholder="Set greeting here..."
        />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendToken}>Send Coins</button>
        <input
          onChange={(e) => setUserAccount(e.target.value)}
          placeholder="Account ID"
        />
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
      </header>
      <h2>{greeting}</h2>
    </div>
  );
};
export default App;
